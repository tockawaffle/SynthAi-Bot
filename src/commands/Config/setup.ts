import { CommandObject, CommandType } from "@tockawa/wokcommands";
import { Client, CommandInteraction, User } from "discord.js";

import { options, gptCategory, language } from "../../configs/commands/exports";

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
    category: "Moderation",
    callback: async ({
        client,
        interaction,
        user,
    }: {
        client: Client;
        interaction: CommandInteraction;
        user: User;
    }) => {
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
                    WHISPERLABS_CATEGORY: "whisperlabs-category",
                };

                const subCommandName = interaction.options.data[0].options![0]
                    .name as keyof typeof SubCommand;

                switch (subCommandName) {
                    case SubCommand.GPT_CATEGORY: {
                        await gptCategory(interaction);
                        break;
                    }
                    case SubCommand.WHISPERLABS_CATEGORY: {
                        return await interaction.reply({
                            content: client.translate(
                                user,
                                "defaults",
                                "notImplemented"
                            ),
                        });
                        break;
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
