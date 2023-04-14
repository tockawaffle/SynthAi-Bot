import { Client } from "discord.js";
import path from "path";
import fs from "fs";

export default async function (client: Client, dir: string) {
    
    if (!fs.existsSync(path.join(__dirname, dir))) {
        const completePath = path.join(__dirname, dir);
        throw new Error(
            `Directory ${dir} does not exist!\nPath: ${completePath}`
        );
    }

    const eventFiles = fs
        .readdirSync(path.join(__dirname, dir))
        .filter((file) => file.endsWith(process.env.FILE_EXTENSION!));
    for (const file of eventFiles) {
        const filePath = path.join(dir, file);
        const { name, execute, once } = await import(filePath);
        if (once) {
            client.once(name, (...args: any) => execute(...args));
        } else {
            client.on(name, (...args: any) => execute(...args));
        }
    }
}
