import { CommandObject, CommandType } from "@tockawa/wokcommands";
import {
    Client,
    CommandInteraction,
    User,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} from "discord.js";

import checkGuild from "../../configs/validators/commands/runtime/checkGuild";
import checkBotPerms from "../../configs/validators/commands/runtime/checkPerms";
import optedOut from "../../configs/database/models/optedOut";
import { askBing, askGpt } from "../../configs/commands/exports";

export default {
    description: "Ask me anything without creating a thread!",
    type: CommandType.SLASH,
    nameLocalizations: {
        "pt-BR": "pergunte-me",
    },
    descriptionLocalizations: {
        "pt-BR": "Pergunte-me qualquer coisa sem criar um tópico!",
    },
    options: [
        {
            name: "question",
            nameLocalizations: {
                "pt-BR": "pergunta",
            },
            description: "What is your question?",
            descriptionLocalizations: {
                "pt-BR": "Qual a sua pergnta?",
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
                    name: "Free",
                    value: "free",
                },
                {
                    name: "Tokenized",
                    value: "token",
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

        const perms = await checkBotPerms(
            interaction,
            [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.SendMessagesInThreads,
            ],
            "bot"
        );
        if (!perms) return;

        const getChoice = interaction.options.get("model", true)
            .value as string;

        switch (getChoice) {
            case "free": {
                await askBing(interaction);
                break;
            }
            case "token": {
                await askGpt(interaction);
                break;
            }
        }
    },
} as CommandObject;
