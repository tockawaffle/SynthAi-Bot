import { CommandInteraction, Message, User } from "discord.js";
import { encode, decode } from "gpt-3-encoder";

import userSchema from "../../database/models/userSchema";

export default async function tokenHandler(
    text: string,
    interaction: CommandInteraction | Message
) {
    const tokens = encode(text).length;

    const tokenCount = tokens / 264;
    const tokenCountRounded =
        Math.round((tokenCount + Number.EPSILON) * 100) / 100;

    let user: User;

    const { client } = interaction;

    if (interaction instanceof Message) {
        user = interaction.author;
    } else {
        user = interaction.user;
    }

    const getUserTokens = await userSchema.findOne({ _id: user.id });
    if (!getUserTokens) {
        await interaction.reply(
            client.translate(user, "defaults", "missingDb")
        );
        return false;
    } else {
        const getTokens =
            getUserTokens.artificialInteligence.chatGPT.avaiableUsage;
        if (getTokens < tokenCountRounded) {
            await interaction.reply(
                client
                    .translate(user, "tokens", "gptNET")
                    .replace("%s", getTokens.toString())
                    .replace("%t", tokenCountRounded.toString())
            );
            return false;
        } else {
            const updateTokens = await userSchema.findOneAndUpdate(
                { _id: user.id },
                {
                    $set: {
                        "artificialInteligence.chatGPT.avaiableUsage":
                            getTokens - tokenCountRounded,
                    },
                },
                { upsert: true }
            );
            if (!updateTokens) {
                await interaction.reply(
                    client.translate(user, "defaults", "missingDb")
                );
                return false;
            } else {
                return true;
            }
        }
    }
}
