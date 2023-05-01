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

export default async function ethernetGpt(
    interaction: CommandInteraction,
    category: string,
    newChat: any
) {
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
        return await interaction.reply({
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
            ],
        });

        const newThread = await newChnl.threads.create({
            name: channelName,
            reason: `Chat with ${user.username}`,
        });

        await interaction.deferReply({ ephemeral: true });

        try {
            const get = await client.gpte(
                "gpt-4",
                process.env.CF!,
                process.env.UA!,
                topic,
                true,
                false
            );
            const {
                contexts,
                tokens,
                model: Model,
                timeUntilCompletion,
            } = get.details;
            const response = get.response;

            const content = `${response}\n\n**Contexts:** ${contexts}\n**Tokens:** ${tokens}\n**Model:** ${Model}\n**Time Until Completion:** ${timeUntilCompletion}`;

            const data = {
                serverId: interaction.guild!.id,
                channelId: newChnl.id,
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
    } else {
        await interaction.deferReply({ ephemeral: true });

        const getChnl = interaction.guild!.channels.cache.get(
            getChatOnThisServer.channelId
        ) as TextChannel;

        if (!getChnl) {
            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $pull: {
                        "channels.gptChat.chat": {
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
            const get = await client.gpte(
                "gpt-4",
                process.env.CF!,
                process.env.UA!,
                topic,
                true,
                false
            );
            const {
                contexts,
                tokens,
                model: Model,
                timeUntilCompletion,
            } = get.details;
            const response = get.response;

            const content = `${response}\n\n**Contexts:** ${contexts}\n**Tokens:** ${tokens}\n**Model:** ${Model}\n**Time Until Completion:** ${timeUntilCompletion}`;

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
