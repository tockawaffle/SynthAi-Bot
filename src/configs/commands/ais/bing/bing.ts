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
} from "../../../database/functions/BingChannel";

import moderate from "../../../../events/__dev/moderation";

export default async (
    interaction: CommandInteraction,
    newChat: any,
    category: string
) => {
    const { user, client } = interaction;
    const bingChat = newChat.channels?.bingChat as {
        chat: [
            {
                serverId: string;
                channelId: string;
            }
        ];
    };

    const getChatOnThisServer = bingChat.chat.filter(
        (chat: { serverId: string }) => chat.serverId === interaction.guild!.id
    )[0];

    const topic = interaction.options.get("subject", true).value as string;

    if (topic.length <= 0)
        return await interaction.reply({
            content: client.translate(user, "startChat", "noTopic"),
        });

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
            name: `bing-chat-${user.username}`,
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
            const bing = await client.bing.sendMessage(topic);

            const data = {
                serverId: interaction.guild!.id,
                channelId: newChnl.id,
                threadId: newThread.id,
                followUp: bing,
                model: "bing",
            };

            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        "channels.bingChat.chat": data,
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
                content: bing.text,
            });
        } catch (error: any) {
            return await interaction.editReply({
                content: client
                    .translate(user, "startChat", "error")
                    .replace("%s", error.message),
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
                        "channels.bingChat.chat": {
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
            const bing = await client.bing.sendMessage(topic);

            const data = {
                serverId: interaction.guild!.id,
                channelId: getChnl.id,
                threadId: newThread.id,
                followUp: bing,
                model: "bing",
            };

            await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $push: {
                        "channels.gptChat.chat": data,
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
                content: bing.text,
            });
        } catch (error: any) {
            return await interaction.editReply({
                content: client
                    .translate(user, "startChat", "error")
                    .replace("%s", error.message),
            });
        }
    }
};
