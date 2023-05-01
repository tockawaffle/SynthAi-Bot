import { Client } from "discord.js";

import RegisterEvents from "../../configs/listeners/events/eventListener";
import RegisterTopEvents from "../../configs/listeners/events/topggEvents";
import bing from "../../configs/ais/chatBased/bing/bing";
import { BasePoster } from "topgg-autoposter/dist/structs/BasePoster";

export default async function (
    client: Client,
    poster: BasePoster,
    evenstDir: string
) {
    await RegisterEvents(client, `${evenstDir}/discord`);
    await RegisterTopEvents(poster, client, `${evenstDir}/topgg`);

    await bing(client);
}
