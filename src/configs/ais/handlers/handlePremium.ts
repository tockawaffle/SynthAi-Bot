import { CommandInteraction } from "discord.js";

export default async (
    interaction: CommandInteraction,
    requiredTier:
        | "free"
        | "freemium"
        | "premium"
        | "premiumPlus"
        | "supporter"
        | "supporterPlus"
        | "tester"
        | "unlimited"
) => {
    const { client, user } = interaction;

    const userTier = user.premium;

    const premiumOrder = {
        free: 0,
        freemium: 1,
        premium: 2,
        premiumPlus: 3,
        supporter: 4,
        supporterPlus: 5,
        tester: 6,
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
