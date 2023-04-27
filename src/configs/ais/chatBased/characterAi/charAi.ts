import { Client } from "discord.js";
import charAi from "node_characterai";

export default async (client: Client) => {
    const c = new charAi();
    await c.authenticateWithToken(process.env.CHARAI_TOKEN!);

    return (client.charai = c);
};
