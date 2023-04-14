import { Client } from "discord.js";

import RegisterEvents from "../../configs/listeners/events/eventListener";
import ChatGPT from "../../configs/ais/gpt/ChatGPT";

export default async function (client: Client, discordEventsDir: string) {
    await RegisterEvents(client, discordEventsDir);

    await ChatGPT(process.env.GPT_KEY!, client);

}
