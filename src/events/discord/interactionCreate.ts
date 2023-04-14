import { Events, Interaction } from "discord.js";

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {},
};
