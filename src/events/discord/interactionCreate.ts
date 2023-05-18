import { Client, Events, Interaction } from "discord.js";
import {
    AI,
    Configuration,
    Credits,
    Main,
    Utilities,
    FAQ,
} from "../../configs/commands/exports";

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction, client: Client) {
        const { user } = interaction;
        if (!user.lang) {
            await interaction.client.loadUser(interaction.client);
        }

        if (interaction.isStringSelectMenu()) {
            const { customId, values } = interaction;

            switch (customId) {
                case "helpMenu": {
                    switch (values[0]) {
                        case "AI": {
                            await AI(interaction, client.WOK);
                            break;
                        }
                        case "Configuration": {
                            await Configuration(interaction, client.WOK);
                            break;
                        }
                        case "Credits": {
                            await Credits(interaction);
                            break;
                        }
                        case "Main Page": {
                            await Main(interaction);
                            break;
                        }
                        case "Utilities": {
                            await Utilities(interaction, client.WOK);
                            break;
                        }
                        case "FAQ": {
                            await FAQ(interaction);
                            break;
                        }
                    }
                }
            }
        }
    },
};
