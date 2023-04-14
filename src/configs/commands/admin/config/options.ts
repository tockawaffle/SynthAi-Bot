import { ApplicationCommandOptionType } from "discord.js";

export default [
    {
        name: "categories",
        nameLocalizations: {
            "pt-BR": "categorias",
        },
        description: "Categories of the bot's configuration.",
        descriptionLocalizations: {
            "pt-BR": "Categorias de configuração do bot.",
        },
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
            {
                name: "gpt-category",
                description:
                    "Set the category so the chat creates a channel for each user.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "category",
                        description: "Set the category.",
                        type: ApplicationCommandOptionType.Channel,
                        required: true,
                    },
                ],
            },
            {
                name: "whisperlabs-category",
                description:
                    "Set the category so the chat creates a channel for each user.",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "category",
                        description: "Set the category.",
                        type: ApplicationCommandOptionType.Channel,
                        required: true,
                    },
                ],
            },
        ],
    },
    {
        name: "language",
        nameLocalizations: {
            "pt-BR": "idioma",
        },
        description: "Set the language you want to use, default is english.",
        descriptionLocalizations: {
            "pt-BR": "Defina o idioma que você deseja usar, o padrão é inglês.",
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "language",
                description: "Set the language you want to use.",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "English",
                        value: "english",
                    },
                    {
                        name: "Portuguese",
                        value: "portuguese",
                    },
                ],
            },
        ],
    },
];
