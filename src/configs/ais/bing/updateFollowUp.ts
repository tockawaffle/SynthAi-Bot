import { ChatMessage } from "bing-chat";

import userSchema from "../../database/models/userSchema";
import { Client, User } from "discord.js";
import {
    loadChannels,
    setUserChannel,
} from "../../database/functions/BingChannel";

export default async (
    followUp: ChatMessage,
    user: User,
    data: { serverId: string; threadId: string },
    client: Client
) => {
    const foundUser = await userSchema.findOne({ _id: user.id });
    if (!foundUser) return false;

    //Update followUp on database
    const newData = foundUser.channels?.bingChat.chat.map((ch) => {
        if (ch.serverId === data.serverId && ch.threadId === data.threadId) {
            ch.followUp = followUp;
        }
        return ch;
    });

    await userSchema.findOneAndUpdate(
        { _id: user.id },
        { $set: { "channels.bingChat.chat": newData } }
    );



    // const getNewData = await userSchema.findOne({ _id: user.id });
    // if (!getNewData) return;

    // const newData = getNewData.channels?.bingChat.chat.filter(
    //     (ch: { serverId: string; threadId: string }) =>
    //         ch.serverId === data.serverId && ch.threadId === data.threadId
    // )[0];

    // // console.log(newData)

    if (!newData) return false;

    await loadChannels(client);
    setUserChannel(user, newData![0]);

    return true
};
