import {
    ChannelType,
    CommandInteraction,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";
import userSchema from "../../../database/models/userSchema";
import {
    loadChannels,
    setUserChannel,
} from "../../../database/functions/BardChannels";

import moderate from "../../../../events/__dev/moderation";

import { v4 } from "uuid";

export default async (
    interaction: CommandInteraction,
    newChat: any,
    category: string
) => {
    const { user, client } = interaction;
    const bardChat = newChat.channels?.bardChat as {
        chat: [
            {
                serverId: string;
                channelId: string;
            }
        ];
    };

    const getChatOnThisServer = bardChat.chat.filter(
        (chat: { serverId: string }) => chat.serverId === interaction.guild!.id
    )[0];

    const topic = interaction.options.get("subject", true).value as string;

    if (topic.length <= 0)
        return await interaction.reply({
            content: client.translate(user, "startChat", "noTopic"),
            ephemeral: true,
        });

    const moderation = await moderate(interaction, topic);
    if (moderation) return;

    await interaction.deferReply({ ephemeral: true });

    const channelName = v4();

    if (!getChatOnThisServer) {
        try {
            const newChnl = await interaction.guild!.channels.create({
                name: `bard-chat-${user.username}`,
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
            });

            const bard: string = await client.bard.ask(topic, channelName);

            const data = {
                serverId: interaction.guild!.id,
                channelId: newChnl.id,
                threadId: newThread.id,
                model: "bard",
            };

            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        "channels.bardChat.chat": data,
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
                content: bard,
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
            return await interaction.editReply({
                content: client
                    .translate(user, "startChat", "error")
                    .replace("%s", error.message),
            });
        }
    } else {
        try {
            const getChnl = interaction.guild!.channels.cache.get(
                getChatOnThisServer.channelId
            ) as TextChannel;

            if (!getChnl) {
                await userSchema.findOneAndUpdate(
                    { _id: user.id },
                    {
                        $pull: {
                            "channels.bardChat.chat": {
                                serverId: interaction.guild!.id,
                                channelId: getChatOnThisServer.channelId,
                            },
                        },
                    }
                );

                return await interaction.editReply({
                    content: client.translate(
                        user,
                        "startChat",
                        "missingChannel"
                    ),
                });
            }

            const newThread = await getChnl!.threads.create({
                name: channelName,
                reason: `Chat with ${user.username}`,
            });

            const bard: string = await client.bard.ask(topic, channelName);

            const data = {
                serverId: interaction.guild!.id,
                channelId: getChnl.id,
                threadId: newThread.id,
                model: "gpt-3.5-turbo",
            };

            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        "channels.bardChat.chat": data,
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
                content: bard,
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
            return await interaction.editReply({
                content: client
                    .translate(user, "startChat", "error")
                    .replace("%s", error.message),
            });
        }
    }
};
