import { Client, Events, Guild, Interaction } from "discord.js";

import serverSchema from "../../configs/database/models/serverSchema";

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(guild: Guild, client: Client) {
        await serverSchema.findOneAndUpdate(
            { _id: guild.id },
            {
                _id: guild.id,
                createdAt: Date.now(),
                premium: {
                    free: true,
                    freemium: false,
                    premium: false,
                    premiumPlus: false,
                    supporter: false,
                    supporterPlus: false,
                    unlimited: false,
                },
            },
            { upsert: true }
        );
        await client.loadUser(client);
    },
};
