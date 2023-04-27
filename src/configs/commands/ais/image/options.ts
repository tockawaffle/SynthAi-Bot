import { ApplicationCommandOptionType } from "discord.js";

export default [
    {
        name: "dall-e",
        nameLocalizations: {
            "pt-BR": "dall-e",
        },
        description: "Generate an image using DALL-E!",
        descriptionLocalizations: {
            "pt-BR": "Gere uma imagem usando DALL-E!",
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "prompt",
                nameLocalizations: {
                    "pt-BR": "prompt",
                },
                description: "A text description of the desired image. (The more detailed, the better.)",
                descriptionLocalizations: {
                    "pt-BR": "Uma descrição textual da imagem desejada. (Quanto mais detalhado, melhor.)",
                },
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "size",
                nameLocalizations: {
                    "pt-BR": "tamanho",
                },
                description: "Size of the image.",
                descriptionLocalizations: {
                    "pt-BR": "Tamanho da imagem.",
                },
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "256x256",
                        nameLocalizations: {
                            "pt-BR": "256x256",
                        },
                        value: "256x256",
                    },
                    {
                        name: "512x512",
                        nameLocalizations: {
                            "pt-BR": "512x512",
                        },
                        value: "512x512",
                    },
                    {
                        name: "1024x1024",
                        nameLocalizations: {
                            "pt-BR": "1024x1024",
                        },
                        value: "1024x1024",
                    },
                ],
            },
        ],
    },
];
