import WOK from "@tockawa/wokcommands";
import { Events, Client } from "discord.js";
import { wokOptions } from "../../configs/client/clientOptions";

import { checkCommands } from "../../configs/validators/commands/validations/checkCommands";
import { loadChannels as loadGptChannels } from "../../configs/database/functions/GptChannels";
import { loadChannels as loadGpteChannels } from "../../configs/database/functions/GpteChannels";
import { loadChannels as loadBardChannels } from "../../configs/database/functions/BardChannels";
import { loadChannels as loadCustomChannels } from "../../configs/database/functions/CustomChannels";

import checkMissingGuilds from "../../configs/database/functions/getGuilds";
import gpte3 from "../../configs/ais/chatBased/gpte/GPT3E";

import translateText, {
    loadUserSettings,
    setUserLanguage,
} from "../../configs/languages/lang";

import ChatGPT, { defineUsers } from "../../configs/ais/chatBased/gpt/ChatGPT";

import changeStatus from "../__dev/changeStatus";
import systemImput from "../__dev/systemImput";
import orchestra from "../../configs/ais/chatBased/bard/sing";

module.exports = {
    name: Events.ClientReady,
    once: false,
    async execute(client: Client) {
        wokOptions.client = client;
        const instance = new WOK(wokOptions);
        client.WOK = instance;

        console.log(
            `\x1b[35m%s\x1b[0m`,
            `[ Bot ]`,
            `> Logado como ${client.user?.tag}!`
        );

        await loadUserSettings(client);
        client.loadUser = loadUserSettings;
        client.setLanguage = setUserLanguage;
        client.translate = translateText;
        client.gptSystem = systemImput;
        client.gpte = gpte3();
        client.bard = await orchestra()
        
        await defineUsers(client);
        await loadGptChannels(client);
        await loadGpteChannels(client);
        await loadBardChannels(client)
        await loadCustomChannels(client);
        await checkMissingGuilds(client);
        await ChatGPT(process.env.GPT_KEY!, client);
        // await charAi(client);

        setTimeout(async () => {
            await checkCommands(client, instance);
        }, 3000);

        await changeStatus(client);
        setInterval(async () => {
            await changeStatus(client);
        }, 3600000);
    },
};
