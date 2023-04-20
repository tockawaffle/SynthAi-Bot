import { CommandObject, CommandType } from "@tockawa/wokcommands";
import {
    Client,
    CommandInteraction,
    User,
    ApplicationCommandOptionType,
} from "discord.js";
import { optIn, optOut } from "../../configs/commands/exports";

export default {
    description: "Opt-in or opt-out of the bot's database.",
    type: CommandType.SLASH,
    nameLocalizations: {
        "pt-BR": "optar",
    },
    descriptionLocalizations: {
        "pt-BR": "Escolha entre ser lembrado ou não pela base de dados do bot.",
    },
    options: [
        {
            name: "choice",
            nameLocalizations: {
                "pt-BR": "escolha",
            },
            description:
                "Choose to be remembered or not by the bot's database.",
            descriptionLocalizations: {
                "pt-BR":
                    "Escolha entre ser lembrado ou não pela base de dados do bot.",
            },
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Opt-in",
                    nameLocalizations: {
                        "pt-BR": "ser-lembrado",
                    },
                    value: "opt-in",
                },
                {
                    name: "Opt-out",
                    nameLocalizations: {
                        "pt-BR": "não-ser-lembrado",
                    },
                    value: "opt-out",
                },
            ],
        },
    ],
    category: "Configuration",
    callback: async ({
        client,
        interaction,
        user,
    }: {
        client: Client;
        interaction: CommandInteraction;
        user: User;
    }) => {
        const choice = interaction.options.get("choice", true).value as string;

        if (choice === "opt-in") {
            return await optIn(interaction);
        } else {
            return await optOut(interaction);
        }
    },
} as CommandObject;
