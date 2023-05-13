import { Client } from "discord.js";

import RegisterEvents from "../../configs/listeners/events/eventListener";
import RegisterTopEvents from "../../configs/listeners/events/topggEvents";
import AutoPoster from "topgg-autoposter";

export default async function (client: Client, evenstDir: string) {
    await RegisterEvents(client, `${evenstDir}/discord`);
    if (process.env.TOPGG_TOKEN) {
        const poster = AutoPoster(process.env.TOPGG_TOKEN!, client);

        await RegisterTopEvents(poster, client, `${evenstDir}/topgg`);
    } else {
        console.log("Top.gg token not found, skipping...");
    }
}
