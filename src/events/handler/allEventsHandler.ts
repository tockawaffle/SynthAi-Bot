import { Client } from "discord.js";

import RegisterEvents from "../../configs/listeners/events/eventListener";
import bing from "../../configs/ais/bing/bing";

export default async function (client: Client, discordEventsDir: string) {
    await RegisterEvents(client, discordEventsDir);
    
    await bing(client);
}
