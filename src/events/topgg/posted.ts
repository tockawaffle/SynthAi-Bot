import { Client } from "discord.js";
import { BasePoster } from "topgg-autoposter/dist/structs/BasePoster";

module.exports = {
    name: "posted",
    once: false,
    execute(posted: BasePoster, client: Client) {},
};
