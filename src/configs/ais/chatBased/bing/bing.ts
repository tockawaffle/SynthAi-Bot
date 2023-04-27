import { Client } from "discord.js";

export default async (client: Client) => {
    const importDynamic = new Function(
        "modulePath",
        "return import(modulePath)"
    );

    const { BingChat } = await importDynamic("bing-chat");

    const api = new BingChat({
        cookie: process.env.BING_KEY!,
    });

    client.bing = api;
};
