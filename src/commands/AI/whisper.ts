import { CommandObject, CommandType } from "@tockawa/wokcommands";
import { Client, CommandInteraction, User } from "discord.js";

import checkGuild from "../../configs/validators/commands/runtime/checkGuild";
import {
    helpHandler,
    translateUrlHandler,
    urlHandler,
    whisperOptions,
} from "../../configs/commands/exports";
import optedOut from "../../configs/database/models/optedOut";

export default {
    nameLocalizations: {
        "pt-BR": "whisper",
    },
    description: "Use Whisper to transcribe/translate an audio file!",
    type: CommandType.SLASH,
    descriptionLocalizations: {
        "pt-BR":
            "Utilize o Whisper para transcrever/traduzir um arquivo de áudio!",
    },
    options: whisperOptions,
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

        const SubCommands = {
            HELP: "help",
            TRANSCRIBE: "transcribe",
            TRANSLATE: "translate",
        };

        const subCommandName = interaction.options.data[0]
            .name as keyof typeof SubCommands;

        switch (subCommandName) {
            case SubCommands.HELP: {
                await helpHandler(interaction);
                break;
            }
            case SubCommands.TRANSCRIBE: {
                const url = interaction.options.get("url", false);
                if (!url) {
                    await interaction.reply({
                        content: client.translate(
                            user,
                            "whisper",
                            "noFileOrUrl"
                        ),
                        ephemeral: true,
                    });
                    break;
                } else {
                    await urlHandler(interaction);
                    break;
                }
            }
            case SubCommands.TRANSLATE: {
                await translateUrlHandler(interaction);
            }
        }
    },
} as CommandObject;
