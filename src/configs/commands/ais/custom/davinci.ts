import {
    ChannelType,
    CommandInteraction,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";
import moderate from "../../../../events/__dev/moderation";
import tokenHandler from "../../../ais/handlers/gptTokenHandler";
import {
    setUserChannel,
    loadChannels,
} from "../../../database/functions/CustomChannels";
import userSchema from "../../../database/models/userSchema";
import personalityChanger from "../../../../events/__dev/personalityChanger";

export default async function (
    interaction: CommandInteraction,
    newChat: any,
    category: string
) {
    const { client, user } = interaction;
    const customChats = newChat.channels!.customChat as {
        chat: [
            {
                serverId: string;
                channelId: string;
            }
        ];
    };

    const getChatOnThisServer = customChats.chat.filter(
        (chat: { serverId: string }) => chat.serverId === interaction.guild!.id
    )[0];

    const topic = interaction.options.get("start-message", true)
        .value as string;
    const personality = interaction.options.get("personality", true)
        .value as "mapple";

    const personalityChange = await personalityChanger(personality);

    if (topic.length <= 0) {
        return await interaction.editReply({
            content: client.translate(user, "startChat", "noTopic"),
        });
    }

    const token = await tokenHandler(topic, interaction);
    if (!token) return;

    const moderation = await moderate(interaction, topic);
    if (moderation) return;

    let channelName: string = "";

    if (topic.length > 100) {
        channelName = topic.slice(0, 100);
    } else {
        channelName = topic;
    }

    await interaction.deferReply({ ephemeral: true });

    if (!getChatOnThisServer) {
        try {
            const newChnl = await interaction.guild!.channels.create({
                name: `custom-chat-${user.username}`,
                type: ChannelType.GuildText,
                parent: category,
                topic: `Chat with ${user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild!.id,
                        deny: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ViewChannel,
                        ],
                    },
                    {
                        id: user.id,
                        allow: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ViewChannel,
                        ],
                    },
                    {
                        id: client.user!.id,
                        allow: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.SendMessagesInThreads,
                            PermissionFlagsBits.ViewChannel,
                        ],
                    },
                ],
            });

            const newThread = await newChnl.threads.create({
                name: channelName,
                reason: `Chat with ${user.username}`,
                invitable: true,
            });

            const davinci = await client.gpte.createCompletion({
                model: "text-davinci-003",
                prompt: `${personalityChange}\n${topic}`,
                temperature: 0.7,
                max_tokens: 512,
                frequency_penalty: 0.53,
                presence_penalty: 0.4,
            });

            const content = davinci.data.choices[0]!.text!;

            const data = {
                serverId: interaction.guild!.id,
                channelId: newChnl.id,
                threadId: newThread.id,
                personality,
            };

            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        "channels.customChat.chat": data,
                    },
                }
            );

            setUserChannel(user, data);
            await loadChannels(client);

            await interaction.editReply({
                content: client
                    .translate(user, "startChat", "chatStarted")
                    .replace("%s", `${newThread}`),
            });

            return await newThread.send({
                content,
            });
        } catch (error: any) {
            if (error.requestBody) {
                const { code, status } = error;
                return await interaction.editReply({
                    content: client
                        .translate(user, "defaults", "permsError")
                        .replace(
                            "%e",
                            `${error.message}\nCode: ${code}\nStatus: ${status}`
                        ),
                });
            }
            await interaction.editReply({
                content: client
                    .translate(user, "defaults", "apiError")
                    .replace("%e", error.message),
            });
        }
    } else {
        const getChnl = interaction.guild!.channels.cache.get(
            getChatOnThisServer.channelId
        ) as TextChannel;

        if (!getChnl) {
            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $pull: {
                        "channels.customChat.chat": {
                            serverId: interaction.guild!.id,
                            channelId: getChatOnThisServer.channelId,
                        },
                    },
                }
            );

            return await interaction.editReply({
                content: client.translate(user, "startChat", "missingChannel"),
            });
        }

        const newThread = await getChnl!.threads.create({
            name: channelName,
            reason: `Chat with ${user.username}`,
        });

        try {
            const davinci = await client.gpte.createCompletion({
                model: "text-davinci-003",
                prompt: `${personalityChange}\n${topic}`,
                temperature: 0.7,
                max_tokens: 512,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            const content = davinci.data.choices[0]!.text!;

            const data = {
                serverId: interaction.guild!.id,
                channelId: getChnl.id,
                threadId: newThread.id,
                personality,
            };

            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        "channels.customChat.chat": data,
                    },
                }
            );

            setUserChannel(user, data);
            await loadChannels(client);

            await interaction.editReply({
                content: client
                    .translate(user, "startChat", "chatStarted")
                    .replace("%s", `${newThread}`),
            });

            return await newThread.send({
                content,
            });
        } catch (error: any) {
            await interaction.editReply({
                content: client
                    .translate(user, "defaults", "apiError")
                    .replace("%e", error.message),
            });
        }
    }
}
