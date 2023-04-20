import { User } from "discord.js";

import optedOut from "../models/optedOut";

export default async(user: User) => {
    const ifOptedOut = await optedOut.find({ _id: "optedOut" });
    const findUser: string[] = ifOptedOut.map((user) => user.ids).flat();

    if (findUser.includes(user.id)) {
        return true;
    } else {
        return false;
    }
}