import { Client, User } from "discord.js";

import user from "../database/models/userSchema";
import translations from "./translations.json";
import optedOut from "../database/models/optedOut";

const userLanguage: any = {};

async function loadUserSettings(client: Client): Promise<void> {
    const userIds = client.users.cache.map((user) => user.id);

    const optedOutDb = await optedOut.find({ _id: "optedOut" });
    const optedOutIds: string[] = optedOutDb.flatMap((user) => user.ids);

    const hasOptedOutUser = userIds.some((userId) =>
        optedOutIds.includes(userId)
    );

    if (hasOptedOutUser) return;

    const foundUsers = await user.find({ _id: { $in: userIds } });

    for (const foundUser of foundUsers) {
        userLanguage[foundUser._id] =
            foundUser?.accountSettings?.language || "english";
    }

    const newUsers = userIds.filter(
        (userId) => !foundUsers.some((user) => user._id === userId)
    );

    for (const newUser of newUsers) {
        if (client.users.cache.get(newUser)?.bot) continue;

        userLanguage[newUser] = "english";
        await user.create({
            _id: newUser,
            accountSettings: { id: newUser, language: "english" },
        });
    }

    for (const [_, user] of client.users.cache) {
        user.lang = userLanguage[user.id];
    }
}
function setUserLanguage(user: User, languages: string) {
    userLanguage[user.id] = languages;
    user.lang = languages;
}

export default (user: User, commandName: string, textId: string): string => {
    const t = translations.traduzido as {
        [key: string]: {
            [key: string]: {
                [key: string]: string;
            };
        };
    };

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
