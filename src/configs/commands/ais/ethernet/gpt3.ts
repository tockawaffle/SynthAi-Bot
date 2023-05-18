import {
    ChannelType,
    CommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";
import moderate from "../../../../events/__dev/moderation";
import tokenHandler from "../../../ais/handlers/gptTokenHandler";
import {
    setUserChannel,
    loadChannels,
} from "../../../database/functions/GpteChannels";
import userSchema from "../../../database/models/userSchema";
import DuckDuckGoSearch from "../../../ais/chatBased/gpte/duckduckgo";
import switcher from "./switcher";
import axios from "axios";

export default async function ethernetGpt(
    interaction: CommandInteraction,
    newChat: any,
    category: string
) {
    await interaction.deferReply({ ephemeral: true });

    const { user, client } = interaction;
    const gpteChat = newChat.channels?.gpteChat as {
        chat: [
            {
                serverId: string;
                channelId: string;
            }
        ];
    };

    const getChatOnThisServer = gpteChat.chat.filter(
        (chat: { serverId: string }) => chat.serverId === interaction.guild!.id
    )[0];

    const topic = interaction.options.get("subject", true).value as string;

    if (topic.length <= 0)
        return await interaction.editReply({
            content: client.translate(user, "startChat", "noTopic"),
        });

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

    if (!getChatOnThisServer) {
        try {
            const newChnl = await interaction.guild!.channels.create({
                name: `gpte-chat-${user.username}`,
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

            let content: string = "";

            const toggler = await switcher();
            if (toggler) {
                const reply = await axios.get(process.env.GPTE_API + "/ask", {
                    params: {
                        prompt: `We are going to roleplay now. You're not YouBot anymore, but a Discord bot, act like one for the sake of roleplay. In the following line, it'll be a user talking to you, answer it in it's language only.\nUser:${topic}`,
                        model: "you",
                    },
                });

                content = reply.data.text;
            } else {
                const gpt = await client.gpte.createChatCompletionPlugin({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: topic,
                        },
                    ],
                    plugins: { DuckDuckGoSearch },
                });
                content = gpt.choices
                    .map(
                        (choice: { message: { content: any } }) =>
                            choice.message?.content
                    )
                    .filter(Boolean)[0];
            }

            const data = {
                serverId: interaction.guild!.id,
                channelId: newChnl.id,
                threadId: newThread.id,
                model: "gpt3-e",
            };

            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        "channels.gpteChat.chat": data,
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
                embeds: [
                    new EmbedBuilder()
                        .setTitle("GPT-E")
                        .setDescription(content)
                        .setColor("Random")
                        .setTimestamp()
                        .setFooter({
                            text: interaction.guild!.name,
                            iconURL: interaction.guild!.iconURL()!,
                        })
                        .setAuthor({
                            name: user.username,
                            iconURL: user.displayAvatarURL()!,
                        }),
                ],
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
                        "channels.gpteChat.chat": {
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
            let content: string = "";
            const toggler = await switcher();
            if (toggler) {
                const reply = await axios.get(process.env.GPTE_API + "/ask", {
                    params: {
                        prompt: topic,
                        model: "you",
                    },
                });

                content = reply.data.text;
            } else {
                const gpt = await client.gpte.createChatCompletionPlugin({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: topic,
                        },
                    ],
                    plugins: { DuckDuckGoSearch },
                });
                content = gpt.choices
                    .map(
                        (choice: { message: { content: any } }) =>
                            choice.message?.content
                    )
                    .filter(Boolean)[0];
            }

            const data = {
                serverId: interaction.guild!.id,
                channelId: getChnl.id,
                threadId: newThread.id,
                model: "gpt-e",
            };

            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        "channels.gpteChat.chat": data,
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
                embeds: [
                    new EmbedBuilder()
                        .setTitle("GPT-E")
                        .setDescription(content)
                        .setColor("Random")
                        .setTimestamp()
                        .setFooter({
                            text: interaction.guild!.name,
                            iconURL: interaction.guild!.iconURL()!,
                        })
                        .setAuthor({
                            name: user.username,
                            iconURL: user.displayAvatarURL()!,
                        }),
                ],
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
