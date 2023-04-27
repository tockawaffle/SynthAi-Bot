import { CommandInteraction } from "discord.js";

import userSchema from "../../database/models/userSchema";

export default async (
    interaction: CommandInteraction,
    size: "256x256" | "512x512" | "1024x1024"
) => {
    const { client, user } = interaction;
    const tokens = await userSchema.findOne(
        { _id: user.id },
        { artificialInteligence: { dalle: 1 } }
    );

    if (!tokens) {
        await interaction.editReply(
            client.translate(user, "defaults", "missingDb")
        );
        return false;
    }

    switch (size) {
        case "256x256": {
            const tokensLeft = tokens.artificialInteligence.dalle.avaiable256;
            if (tokensLeft < 1) {
                await interaction.editReply(
                    client
                        .translate(user, "tokens", "dalleNET")
                        .replace("%s", tokensLeft.toString())
                        .replace("%t", "1")
                        .replace(
                            "%r",
                            `256x256: ${tokensLeft}\n512x512: ${tokens.artificialInteligence.dalle.avaiable512}\n1024x1024: ${tokens.artificialInteligence.dalle.avaiable1024}`
                        )
                );
                return false;
            } else {
                const updateTokens = await userSchema.findOneAndUpdate(
                    { _id: user.id },
                    {
                        $set: {
                            "artificialInteligence.dalle.avaiable256":
                                tokensLeft - 1,
                        },
                    },
                    { upsert: true }
                );
                if (!updateTokens) {
                    await interaction.editReply(
                        client.translate(user, "defaults", "missingDb")
                    );
                    return false;
                } else return true;
            }
        }
        case "512x512": {
            const tokensLeft = tokens.artificialInteligence.dalle.avaiable512;
            if (tokensLeft < 1) {
                await interaction.editReply(
                    client
                        .translate(user, "tokens", "dalleNET")
                        .replace("%s", tokensLeft.toString())
                        .replace("%t", "1")
                        .replace(
                            "%r",
                            `256x256: ${tokens.artificialInteligence.dalle.avaiable256}\n512x512: ${tokensLeft}\n1024x1024: ${tokens.artificialInteligence.dalle.avaiable1024}`
                        )
                );
                return false;
            } else {
                const updateTokens = await userSchema.findOneAndUpdate(
                    { _id: user.id },
                    {
                        $set: {
                            "artificialInteligence.dalle.avaiable512":
                                tokensLeft - 1,
                        },
                    },
                    { upsert: true }
                );
                if (!updateTokens) {
                    await interaction.editReply(
                        client.translate(user, "defaults", "missingDb")
                    );
                    return false;
                } else return true;
            }
        }
        case "1024x1024": {
            const tokensLeft = tokens.artificialInteligence.dalle.avaiable1024;
            if (tokensLeft < 1) {
                await interaction.editReply(
                    client
                        .translate(user, "tokens", "dalleNET")
                        .replace("%s", tokensLeft.toString())
                        .replace("%t", "1")
                        .replace(
                            "%r",
                            `256x256: ${tokens.artificialInteligence.dalle.avaiable256}\n512x512: ${tokens.artificialInteligence.dalle.avaiable512}\n1024x1024: ${tokensLeft}`
                        )
                );
                return false;
            } else {
                const updateTokens = await userSchema.findOneAndUpdate(
                    { _id: user.id },
                    {
                        $set: {
                            "artificialInteligence.dalle.avaiable1024":
                                tokensLeft - 1,
                        },
                    },
                    { upsert: true }
                );
                if (!updateTokens) {
                    await interaction.editReply(
                        client.translate(user, "defaults", "missingDb")
                    );
                    return false;
                } else return true;
            }
        }
    }
};
