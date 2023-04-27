import { CommandObject, CommandType } from "@tockawa/wokcommands";
import {
    Client,
    CommandInteraction,
    User,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} from "discord.js";

import serverSchema from "../../configs/database/models/serverSchema";
import userSchema from "../../configs/database/models/userSchema";

import checkGuild from "../../configs/validators/commands/runtime/checkGuild";
import checkPerms from "../../configs/validators/commands/runtime/checkPerms";
import optedOut from "../../configs/database/models/optedOut";
import { Bing, GPT } from "../../configs/commands/exports";

export default {
    description: "Start a chat with the bot!",
    type: CommandType.SLASH,
    nameLocalizations: {
        "pt-BR": "iniciar-chat",
    },
    descriptionLocalizations: {
        "pt-BR": "Inicie um chat com o bot!",
    },
    options: [
        {
            name: "subject",
            nameLocalizations: {
                "pt-BR": "assunto",
            },
            description: "The subject of the chat.",
            descriptionLocalizations: {
                "pt-BR": "O assunto do chat.",
            },
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "model",
            nameLocalizations: {
                "pt-BR": "modelo",
            },
            description: "The model to use.",
            descriptionLocalizations: {
                "pt-BR": "O modelo a ser usado.",
            },
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "GPT-3.5",
                    value: "gpt3",
                },
                {
                    name: "Bing Chat",
                    value: "bing",
                },
            ],
        },
    ],
    category: "AI",
    callback: async ({
        client,
        interaction,
        user,
    }: {
        client: Client;
        interaction: CommandInteraction;
        user: User;
    }) => {
        const isOptedOut = await optedOut.findOne({ _id: "optedOut", ids: { $in: [user.id] } })
        if (isOptedOut) {
            return await interaction.reply({
                content:
                    "You have opted out of the bot. You cannot use any features I have until you opt back in.",
                ephemeral: true,
            });
        }

        if (!checkGuild(interaction)) {
            return await interaction.reply({
                content: client.translate(user, "defaults", "NaG"),
                ephemeral: true,
            });
        }

        const getCategory = await serverSchema.findOne(
            { _id: interaction.guild!.id },
            { channels: { gptCategory: 1, bingCategory: 1 } }
        );

        const perms = await checkPerms(
            interaction,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ManageThreads,
                PermissionFlagsBits.CreatePrivateThreads,
                PermissionFlagsBits.CreatePublicThreads,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessagesInThreads,
            ],
            "bot"
        );

        if (!perms) return;

        const getChoice = interaction.options.get("model", true)
            .value as string;

        switch (getChoice) {
            case "gpt3": {
                const category = getCategory!.channels.gptCategory as
                    | string
                    | undefined;
                if (!category || category.length <= 0) {
                    return await interaction.reply({
                        content: client.translate(
                            user,
                            "startChat",
                            "categoryNotSet"
                        ),
                        ephemeral: true,
                    });
                }

                const newChat = await userSchema.findOne(
                    { _id: user.id },
                    { channels: { gptChat: 1 } }
                );

                if (!newChat) {
                    return await interaction.reply({
                        content: client.translate(
                            user,
                            "startChat",
                            "noUserDb"
                        ),
                        ephemeral: true,
                    });
                }

                await GPT(interaction, newChat, category);
                break;
            }
            case "bing": {
                const category = getCategory!.channels.bingCategory as
                    | string
                    | undefined;
                if (!category || category.length <= 0) {
                    return await interaction.reply({
                        content: client.translate(
                            user,
                            "startChat",
                            "categoryNotSet"
                        ),
                        ephemeral: true,
                    });
                }

                const newChat = await userSchema.findOne(
                    { _id: user.id },
                    { channels: { bingChat: 1 } }
                );

                if (!newChat) {
                    return await interaction.reply({
                        content: client.translate(
                            user,
                            "startChat",
                            "noUserDb"
                        ),
                        ephemeral: true,
                    });
                }

                await Bing(interaction, newChat, category);
                break;
            }
        }
    },
} as CommandObject;
