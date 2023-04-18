import {
    ChannelType,
    Client,
    CommandInteraction,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";
import userSchema from "../../../database/models/userSchema";

export default async (
    interaction: CommandInteraction,
    newChat: any,
    category: string
) => {
    const { user, client } = interaction;
    const gptChat = newChat.channels?.bingChat as {
        chat: [
            {
                serverId: string;
                channelId: string;
            }
        ];
    };

    const getChatOnThisServer = gptChat.chat.filter(
        (chat: { serverId: string }) => chat.serverId === interaction.guild!.id
    )[0];

    const topic = interaction.options.get("subject", true).value as string;

    if (!getChatOnThisServer) {
        const newChnl = await interaction.guild!.channels.create({
            name: `gpt-chat-${user.username}`,
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
            name: topic,
            reason: `Chat with ${user.username}`,
        });

        await interaction.deferReply();

        const bing = await client.bing.sendMessage(topic);

        await userSchema.findOneAndUpdate(
            { _id: user.id },
            {
                $push: {
                    "channels.gptChat.chat": {
                        serverId: interaction.guild!.id,
                        channelId: newChnl.id,
                        threadId: newThread.id,
                        followUpId: bing.id,
                    },
                },
            }
        );

        await interaction.editReply({
            content: client
                .translate(user, "startChat", "chatStarted")
                .replace("%s", newThread),
        });

        return await newThread.send({
            content: bing.text,
        });
    } else {
        await interaction.deferReply();

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
            name: topic,
            reason: `Chat with ${user.username}`,
        });

        // const gpt = await client.gpt.sendMessage(topic);

        // await userSchema.findOneAndUpdate(
        //     { _id: user.id },
        //     {
        //         $push: {
        //             "channels.gptChat.chat": {
        //                 serverId: interaction.guild!.id,
        //                 channelId: getChnl.id,
        //                 threadId: newThread.id,
        //                 followUpId: gpt.id,
        //             },
        //         },
        //     }
        // );

        // await interaction.editReply({
        //     content: client
        //         .translate(user, "startChat", "chatStarted")
        //         .replace("%s", newThread),
        // });

        // return await newThread.send({
        //     content: gpt.text,
        // });
    }
};
