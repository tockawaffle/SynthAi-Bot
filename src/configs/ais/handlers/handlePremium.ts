import { CommandInteraction } from "discord.js";

export default async (
    interaction: CommandInteraction,
    requiredTier:
        | "free"
        | "premium"
        | "supporter"
        | "patron"
        | "unlimited"
) => {
    const { client, user } = interaction;

    const userTier = user.premium;

    const premiumOrder = {
        free: 0,
        premium: 2,
        supporter: 4,
        patron: 6,
        unlimited: 7,
    };

    if (premiumOrder[userTier] < premiumOrder[requiredTier]) {
        await interaction.reply({
            content: client
                .translate(user, "defaults", "insufficientTier")
                .replace("%t", requiredTier),
            ephemeral: true,
        });
        //Returns the tier the user has
        return false
    } else return true
};
