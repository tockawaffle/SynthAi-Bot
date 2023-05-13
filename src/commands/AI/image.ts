import { CommandObject, CommandType } from "@tockawa/wokcommands";
import { Client, CommandInteraction, User } from "discord.js";

import checkGuild from "../../configs/validators/commands/runtime/checkGuild";
import { dalleGenerator, dalleOptions } from "../../configs/commands/exports";
import optedOut from "../../configs/database/models/optedOut";

export default {
    nameLocalizations: {
        "pt-BR": "imagem",
    },
    descriptionLocalizations: {
        "pt-BR":
            "Utilize de IAs para gerar imagens via prompt, diretamente no Discord!",
    },
    description: "Use AIs to generate images via prompt, directly on Discord!",
    type: CommandType.SLASH,
    options: dalleOptions,
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
            DALLE: "dall-e",
            STABLEDIFFUSION: "stable-diffusion",
        };

        const subCommandName = interaction.options.data[0]
            .name as keyof typeof SubCommands;

        switch (subCommandName) {
            case SubCommands.DALLE: {
                await dalleGenerator(interaction);
                break;
            }
            case SubCommands.STABLEDIFFUSION: {
                await interaction.reply({
                    content: "You should not be seeing this.",
                });
                break;
            }
        }
    },
} as CommandObject;
