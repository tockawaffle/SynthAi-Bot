import { CommandInteraction } from "discord.js";

export default function (interaction: CommandInteraction) {
    const { guild } = interaction;
    if (!guild) return false;
    return true;
}
