import { Client, Events, Guild, Interaction } from "discord.js";

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(guild: Guild, client: Client) {
        await client.loadUser(client)
    },
};
