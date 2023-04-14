import { Client, User } from "discord.js";

import user from "../database/models/userSchema";
import translations from "./translations.json";

const userLanguage: any = {};
async function loadUserSettings(client: Client): Promise<void> {
    for (const users of client.users.cache) {
        const userId = users[0],
            result = await user.findOne({ _id: userId });
        userLanguage[userId] = result
            ? result!.accountSettings.language
            : await user.findOneAndUpdate(
                  { _id: userId },
                  {
                      _id: userId,
                      account_settings: {
                          language: "english",
                      },
                  },
                  { upsert: true }
              );
    }
}
function setUserLanguage(user: User, languages: string) {
    userLanguage[user.id] = languages;
}

export default (user: User, commandName: any, textId: any): string => {
    const t = translations.traduzido as any;
    let u: User;
    if (!user) throw new Error(`argument "user" missing`);
    if (user instanceof User) {
        u = user;
    } else
        throw new Error(
            `Invalid argument: user, not an instance of the class "User"`
        );

    if (!t[commandName][textId]) {
        throw new Error(`Text ID: ${textId} is undefined`);
    }
    const selectedLanguage = userLanguage[u!.id];
    return t[commandName][textId][selectedLanguage];
};

export { loadUserSettings, setUserLanguage };
