import "dotenv/config";

import { Client } from "discord.js";
import { clientOptions } from "./configs/client/clientOptions";
import allEventsHandler from "./events/handler/allEventsHandler";

export const client = new Client(clientOptions);

(async () => {
    await allEventsHandler(client, "../../../events/discord/");
    client.login(process.env.DISCORD_TOKEN);
})();
