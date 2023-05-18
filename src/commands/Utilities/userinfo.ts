import { CommandObject, CommandType } from "@tockawa/wokcommands";
import { Client, CommandInteraction, EmbedBuilder, User } from "discord.js";

import userSchema from "../../configs/database/models/userSchema";
import optedOut from "../../configs/database/models/optedOut";
import moment from "moment";

export default {
    description:
        "Shows some information about yourself, like token balance, etc",
    type: CommandType.SLASH,
    nameLocalizations: {
        "pt-BR": "userinfo",
    },
    descriptionLocalizations: {
        "pt-BR":
            "Mostra algumas informações sobre você, como saldo de tokens, etc",
    },
    category: "Utilities",
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

        const userDb = await userSchema.findOne({
            _id: user.id,
        });

        if (!userDb) {
            return await interaction.reply({
                content: client.translate(user, "defaults", "missingDb"),
                ephemeral: true,
            });
        }

        const avaiableGptTokens =
            userDb.artificialInteligence.chatGPT.avaiableUsage;
        const avaiableWhisperTokens =
            userDb.artificialInteligence.whisper.avaiableUsage;
        const avaiableDalle1024Tokens =
            userDb.artificialInteligence.dalle.avaiable1024;
        const avaiableDalle512Tokens =
            userDb.artificialInteligence.dalle.avaiable512;
        const avaiableDalle256Tokens =
            userDb.artificialInteligence.dalle.avaiable256;

        const premium = userDb.premium;
        const dbCreatedAt = userDb.createdAt;

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: user.tag,
                        iconURL: user.displayAvatarURL(),
                    })
                    .setColor("Random")
                    .setFooter({
                        text: client
                            .translate(user, "help", "helpFooter")
                            .replace(
                                "%botOwner%",
                                client.users.cache.get(process.env.OWNER_ID!)!
                                    .tag
                            ),
                        iconURL: client.users.cache
                            .get(process.env.OWNER_ID!)!
                            .displayAvatarURL(),
                    })
                    .addFields(
                        {
                            name: client.translate(user, "userinfo", "premium"),
                            value: premium,
                        },
                        {
                            name: client.translate(
                                user,
                                "userinfo",
                                "createdAt"
                            ),
                            value: moment(dbCreatedAt).format(
                                "DD/MM/YYYY HH:mm:ss"
                            ),
                        },
                        {
                            name: client.translate(user, "userinfo", "tokens"),
                            value: `Gpt Tokens: \`\`\`${avaiableGptTokens} tokens\`\`\`\nWhisper Tokens: \`\`\`${avaiableWhisperTokens}m\`\`\`\n1024 x 1024 (DALL-E): \`\`\`${avaiableDalle1024Tokens} tokens\`\`\`\n512 x 512 (DALL-E): \`\`\`${avaiableDalle512Tokens} tokens\`\`\`\n256 x 256 (DALL-E): \`\`\`${avaiableDalle256Tokens} tokens\`\`\``,
                        }
                    ),
            ],
            ephemeral: true,
        });
    },
} as CommandObject;
