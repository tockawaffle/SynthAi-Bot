import { Events, Guild, Interaction } from "discord.js";

import serverSchema from "../../configs/database/models/serverSchema";

module.exports = {
    name: Events.GuildDelete,
    once: false,
    async execute(guild: Guild) {
        const server = await serverSchema.findOne({ _id: guild.id });
        if (server) {
            await serverSchema.deleteOne({ _id: guild.id });
            return;
        } else return;
    },
};
