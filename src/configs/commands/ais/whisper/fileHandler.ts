import { CommandInteraction } from "discord.js";

export default async(interaction: CommandInteraction) => {
    return await interaction.reply({
        content: interaction.client.translate(interaction.user, "whipser", "notImplemented"),
        ephemeral: true
    })
}