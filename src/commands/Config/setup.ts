import { CommandObject, CommandType } from "@tockawa/wokcommands";
import { Client, CommandInteraction, User } from "discord.js";

import {
    options,
    gptCategory,
    language,
    gpteCategory,
    customCategory,
} from "../../configs/commands/exports";
import handleOptedOut from "../../configs/database/functions/handleOptedOut";

export default {
    description: "Configuration command for the bot's moderators.",
    type: CommandType.SLASH,
    nameLocalizations: {
        "pt-BR": "config",
    },
    descriptionLocalizations: {
        "en-US": "Configuration command for the bot's moderators.",
        "pt-BR": "Comando de configuração para os moderadores do bot!",
    },
    options,
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
        if (await handleOptedOut(user)) {
            return await interaction.reply(
                "You opted out of this bot, you cannot use any features I have avaiable."
            );
        }

        const SubCommandGroup = {
            CATEGORIES: "categories",
            LANGUAGE: "language",
        };

        const subCommandGroupName = interaction.options.data[0]
            .name as keyof typeof SubCommandGroup;

        switch (subCommandGroupName) {
            case SubCommandGroup.CATEGORIES: {
                const SubCommand = {
                    GPT_CATEGORY: "gpt-category",
                    GPTE_CATEGORY: "gpte-category",
                    CUSTOM_CATEGORY: "custom-category",
                };

                const subCommandName = interaction.options.data[0].options![0]
                    .name as keyof typeof SubCommand;

                switch (subCommandName) {
                    case SubCommand.GPT_CATEGORY: {
                        await gptCategory(interaction);
                        break;
                    }
                    case SubCommand.GPTE_CATEGORY: {
                        await gpteCategory(interaction);
                        break;
                    }
                    case SubCommand.CUSTOM_CATEGORY: {
                        await customCategory(interaction);
                    }
                }
            }
            case SubCommandGroup.LANGUAGE: {
                const SubCommand = {
                    LANGUAGE: "language",
                };

                const subCommandName = interaction.options.data[0].options![0]
                    .name as keyof typeof SubCommand;

                switch (subCommandName) {
                    case SubCommand.LANGUAGE: {
                        const lang = interaction.options.get("language", true)
                            .value! as "english" | "portugues";

                        await language(interaction, lang);
                        break;
                    }
                }
            }
        }
    },
} as CommandObject;
