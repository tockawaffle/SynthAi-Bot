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
import { GPT, GPT3E, help } from "../../configs/commands/exports";
import davinci from "../../configs/commands/ais/custom/davinci";

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
            name: "assistants",
            description: "Choose which assistant to chat with.",
            descriptionLocalizations: {
                "pt-BR": "Escolha com qual assistente conversar.",
            },
            type: ApplicationCommandOptionType.Subcommand,
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
                            name: "GPT-3 W/Ethernet",
                            value: "gpt3e",
                        },
                        {
                            name: "GPT-4 W/Ethernet (Not Available)",
                            value: "gpt4e",
                        },
                    ],
                },
            ],
        },
        // {
        //     name: "custom",
        //     description: "Start a chat with a chatbot of your choice.",
        //     descriptionLocalizations: {
        //         "pt-BR": "Inicie um chat com um chatbot de sua escolha.",
        //     },
        //     type: ApplicationCommandOptionType.Subcommand,
        //     options: [
        //         {
        //             name: "start-message",
        //             nameLocalizations: {
        //                 "pt-BR": "mensagem-inicial",
        //             },
        //             description: "The message to start the chat with.",
        //             descriptionLocalizations: {
        //                 "pt-BR": "A mensagem para iniciar o chat.",
        //             },
        //             type: ApplicationCommandOptionType.String,
        //             required: true,
        //         },
        //         {
        //             name: "personality",
        //             nameLocalizations: {
        //                 "pt-BR": "personalidade",
        //             },
        //             description:
        //                 "The personality to use. Use the help command to see details",
        //             descriptionLocalizations: {
        //                 "pt-BR":
        //                     "A personalidade a ser usada. Use o comando de ajuda para ver detalhes",
        //             },
        //             type: ApplicationCommandOptionType.String,
        //             choices: [
        //                 {
        //                     name: "Mapple",
        //                     value: "mapple",
        //                 },
        //             ],
        //             required: true,
        //         },
        //     ],
        // },
        {
            name: "help",
            description: "Get help with starting a chat.",
            descriptionLocalizations: {
                "pt-BR": "Obtenha ajuda para iniciar um chat.",
            },
            type: ApplicationCommandOptionType.Subcommand,
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
        const isOptedOut = await optedOut.findOne({
            _id: "optedOut",
            ids: { $in: [user.id] },
        });
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
            "bot",
            "noPermsBot"
        );

        if (!perms) return;

        const subCommand = {
            ASSISTANT: "assistants",
            CUSTOM: "custom",
            HELP: "help",
        };

        const subCommandName = interaction.options.data[0]
            .name as keyof typeof subCommand;

        switch (subCommandName) {
            case subCommand.ASSISTANT: {
                const getCategory = await serverSchema.findOne(
                    { _id: interaction.guild!.id },
                    {
                        channels: {
                            gptCategory: 1,
                            gpteCategory: 1,
                        },
                    }
                );

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
                    case "gpt3e": {
                        const category = getCategory!.channels.gpteCategory as
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
                            { channels: { gpteChat: 1 } }
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

                        await GPT3E(interaction, newChat, category);
                        break;
                    }
                    case "gpt4e": {
                        return await interaction.reply({
                            content:
                                "This option is going through a major rework. Please use the other options for now.",
                            ephemeral: true,
                        });

                        // const category = getCategory!.channels.gpteCategory as
                        //     | string
                        //     | undefined;
                        // if (!category || category.length <= 0) {
                        //     return await interaction.reply({
                        //         content: client.translate(
                        //             user,
                        //             "startChat",
                        //             "categoryNotSet"
                        //         ),
                        //         ephemeral: true,
                        //     });
                        // }

                        // const newChat = await userSchema.findOne(
                        //     { _id: user.id },
                        //     { channels: { gpteChat: 1 } }
                        // );

                        // if (!newChat) {
                        //     return await interaction.reply({
                        //         content: client.translate(
                        //             user,
                        //             "startChat",
                        //             "noUserDb"
                        //         ),
                        //         ephemeral: true,
                        //     });
                        // }

                        // await GPTE(interaction, category, newChat);
                    }
                }
                break;
            }
            case subCommand.CUSTOM: {
                const getCategory = await serverSchema.findOne(
                    { _id: interaction.guild!.id },
                    {
                        channels: {
                            customCategory: 1,
                        },
                    }
                );

                const category = getCategory!.channels.customCategory as
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
                    { channels: { customChat: 1 } }
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

                await davinci(interaction, newChat, category);
                break;
            }
            case subCommand.HELP: {
                await help(interaction);
                break;
            }
        }
    },
} as CommandObject;
