import { Events, Client } from "discord.js";
import { wokOptions } from "../../configs/client/clientOptions";

import WOK from "@tockawa/wokcommands";
import { checkCommands } from "../../configs/validators/commands/validations/checkCommands";
import translateText, {
    loadUserSettings,
    setUserLanguage,
} from "../../configs/languages/lang";

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

        await loadUserSettings(client);

        client.loadUser = loadUserSettings;
        client.setLanguage = setUserLanguage;
        client.translate = translateText;

        setTimeout(async () => {
            await checkCommands(client, instance);
        }, 3000);
    },
};
