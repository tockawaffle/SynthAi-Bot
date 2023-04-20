import { Events, Client } from "discord.js";
import { wokOptions } from "../../configs/client/clientOptions";

import WOK from "@tockawa/wokcommands";
import { checkCommands } from "../../configs/validators/commands/validations/checkCommands";
import { loadChannels as loadGptChannels } from "../../configs/database/functions/GptChannels";
import { loadChannels as loadBingChannels } from "../../configs/database/functions/BingChannel";
import checkMissingGuilds from "../../configs/database/functions/getGuilds";
import translateText, {
    loadUserSettings,
    setUserLanguage,
} from "../../configs/languages/lang";
import ChatGPT, { defineUsers } from "../../configs/ais/gpt/ChatGPT";
import changeStatus from "../__dev/changeStatus";

module.exports = {
    name: Events.ClientReady,
    once: false,
    async execute(client: Client) {
        wokOptions.client = client;
        const instance = new WOK(wokOptions);
        console.log(
            `\x1b[35m%s\x1b[0m`,
            `[ Bot ]`,
            `> Logado como ${client.user?.tag}!`
        );

        await ChatGPT(process.env.GPT_KEY!, client);
        await defineUsers(client);
        await checkMissingGuilds(client);

        await loadGptChannels(client);
        await loadBingChannels(client);

        await loadUserSettings(client);

        client.loadUser = loadUserSettings;
        client.setLanguage = setUserLanguage;
        client.translate = translateText;
        client.WOK = instance;

        setTimeout(async () => {
            await checkCommands(client, instance);
        }, 3000);

        await changeStatus(client);
        setInterval(async () => {
            await changeStatus(client);
        }, 3600000);
    },
};
