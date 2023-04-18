import { Partials, GatewayIntentBits, REST } from "discord.js";
import { Options } from "@tockawa/wokcommands";
import { client } from "../../bot";
import path from "path";

export const clientOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.GuildMember,
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
    ],
};

export const wokOptions = {
    client,
    mongoUri: process.env.MONGO_URI,
    mongoModals: path.join(__dirname, "../../models"),
    commandsDir: path.join(__dirname, "../../commands"),
    defaultLanguage: "english",
    testServers: [process.env.TEST_SERVERS],
    botOwners: [process.env.OWNER_ID],
} as Options;

export const RESTdjs = new REST({ version: "10" }).setToken(
    process.env.DISCORD_TOKEN as string
);