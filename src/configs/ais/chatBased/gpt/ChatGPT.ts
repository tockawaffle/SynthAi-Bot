import { Client } from "discord.js";
import { Configuration } from "openai/dist/configuration";
import { OpenAIApi } from "openai/dist/api";
import userSchema from "../../../database/models/userSchema";

export default async function (apiKey: string, client: Client) {
    const conf = new Configuration({
        apiKey,
    });

    const chatCompletion = new OpenAIApi(conf);

    client.openai = chatCompletion;
}

export async function defineUsers(client: Client) {
    const userIds = client.users.cache.map((user) => user.id);
    const foundUsers = await userSchema.find({ _id: { $in: userIds } });

    for (const foundUser of foundUsers) {
        client.users.cache.get(foundUser._id)!.premium = foundUser.premium;
    }
}
