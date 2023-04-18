import { Client, GuildChannel, TextChannel, User } from "discord.js";

import serverSchema from "../models/serverSchema";

export default async function checkMissingGuilds(
    client: Client
): Promise<void> {
    const guilds = client.guilds.cache.map((guild) => guild.id);

    const foundServers = await serverSchema.find();
    const foundServersIds = foundServers.map((server) => server._id);

    //check if the server is registered in the database
    for (const guild of guilds) {
        if (!foundServersIds.includes(guild)) {
            await serverSchema.findOneAndUpdate(
                { _id: guild },
                {
                    _id: guild,
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
        }
    }
}
