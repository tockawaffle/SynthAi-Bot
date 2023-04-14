import { CommandObject, CommandType } from "@tockawa/wokcommands";
import {
    Client,
    CommandInteraction,
    ApplicationCommandOptionType,
    User,
} from "discord.js";

import { gptCategory, options } from "../../../configs/commands/exports";

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
    guildOnly: true,
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

        console.log(subCommandGroupName)
        switch (subCommandGroupName) {
            case SubCommandGroup.CATEGORIES: {
                const SubCommand = {
                    GPT_CATEGORY: "gpt-category",
                    WHISPERLABS_CATEGORY: "whisperlabs-category",
                };

                const subCommandName = interaction.options.data[0].options![0]
                    .name as keyof typeof SubCommand;

                console.log(subCommandName)
            }
        }


                        
    },
} as CommandObject;
