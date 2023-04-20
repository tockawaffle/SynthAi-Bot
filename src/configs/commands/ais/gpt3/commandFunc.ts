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
} from "../../../database/functions/GptChannels";
import tokenHandler from "../../../ais/handlers/tokenHandler";

export default async (
    interaction: CommandInteraction,
    newChat: any,
    category: string
) => {
    const { user, client } = interaction;
    const gptChat = newChat.channels?.gptChat as {
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

    const token = await tokenHandler(topic, interaction)
    if(!token) return;

    const moderation = (
        await client.gpt.createModeration({
            model: "text-moderation-latest",
            input: topic,
        })
    ).data.results[0];

    if (moderation.flagged) {
        const flags = moderation.categories as {
            sexual: boolean;
            hate: boolean;
            violence: boolean;
            "self-harm": boolean;
            "sexual/minors": boolean;
            "hate/threatening": boolean;
            "violence/graphic": boolean;
        };

        const flagsArray = Object.entries(flags).filter(
            (flag) => flag[1] === true
        );

        const flagsString = flagsArray.map((flag) => flag[0]).join(", ");

        return interaction.reply({
            content: `${client.translate(
                user,
                "defaults",
                "moderationFlagged"
            )} ${flagsString}.`,
            ephemeral: true,
        });
    }

    let channelName: string = "";

    if (topic.length > 100) {
        channelName = topic.slice(0, 100);
    } else {
        channelName = topic;
    }

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
            name: channelName,
            reason: `Chat with ${user.username}`,
        });

        await interaction.deferReply({ ephemeral: true });

        const gpt = await client.gpt.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: topic,
                },
                {
                    role: "system",
                    content: `You are chatting with ${
                        user.username
                    }, answer the user precisely and in their language input. Do not use any prefixes at the start of messages. You are on Discord, integrated via your API. The bot's name is ${
                        client.user!.username
                    }, you were created and developed by ${client.users.cache.get("876578406144290866")!.username}.`,
                },
            ],
            max_tokens: 250,
        });

        const data = {
            serverId: interaction.guild!.id,
            channelId: newChnl.id,
            threadId: newThread.id,
            model: "gpt-3.5-turbo",
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
                .replace("%s", newThread),
        });

        return await newThread.send({
            content: gpt.data.choices[0].message!.content,
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
            name: channelName,
            reason: `Chat with ${user.username}`,
        });

        const gpt = await client.gpt.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: topic,
                },
                {
                    role: "system",
                    content: `You are chatting with ${
                        user.username
                    }, answer the user precisely and in their language input. Do not use any prefixes at the start of messages. You are on Discord, integrated via your API. The bot's name is ${
                        client.user!.username
                    }, created by ${client.application!.owner}.`,
                },
            ],
            max_tokens: 250,
        });

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
                    "channels.gptChat.chat": data,
                },
            }
        );

        setUserChannel(user, data);
        await loadChannels(client);

        await interaction.editReply({
            content: client
                .translate(user, "startChat", "chatStarted")
                .replace("%s", newThread),
        });

        return await newThread.send({
            content: gpt.data.choices[0].message!.content,
        });
    }
};
