import "dotenv/config";

import { Client } from "discord.js";
import { clientOptions } from "./configs/client/clientOptions";
import allEventsHandler from "./events/handler/allEventsHandler";
import AutoPoster from "topgg-autoposter";

export const client = new Client(clientOptions);
const poster = AutoPoster(process.env.TOPGG_TOKEN!, client);

(async () => {
    await allEventsHandler(client, poster, "../../../events");
    client.login(process.env.DISCORD_TOKEN);
})();
