import { Events, Interaction } from "discord.js";

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        const {user} = interaction
        if(!user.lang) {
            await interaction.client.loadUser(interaction.client)
            
        }
    },
};
