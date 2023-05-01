import WOK from "@tockawa/wokcommands";
import { Events, Client } from "discord.js";
import { wokOptions } from "../../configs/client/clientOptions";

import { checkCommands } from "../../configs/validators/commands/validations/checkCommands";
import { loadChannels as loadGptChannels } from "../../configs/database/functions/GptChannels";
import { loadChannels as loadBingChannels } from "../../configs/database/functions/BingChannel";
import { loadChannels as loadGpteChannels } from "../../configs/database/functions/GpteChannels";

import charAi from "../../configs/ais/chatBased/characterAi/charAi";
import checkMissingGuilds from "../../configs/database/functions/getGuilds";
import phind from "../../../custom_modules/REAPI";

import translateText, {
    loadUserSettings,
    setUserLanguage,
} from "../../configs/languages/lang";

import ChatGPT, { defineUsers } from "../../configs/ais/chatBased/gpt/ChatGPT";

import changeStatus from "../__dev/changeStatus";
import systemImput from "../__dev/systemImput";

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
        client.gpte = phind;

        await defineUsers(client);
        await loadGptChannels(client);
        await loadGpteChannels(client)
        await loadBingChannels(client);
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
