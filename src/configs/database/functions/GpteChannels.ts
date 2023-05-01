import {
    ChannelType,
    Client,
    GuildChannel,
    TextChannel,
    User,
} from "discord.js";

import userSchema from "../models/userSchema";
import userInterface from "../interfaces/userInterface";

const channels: any = {};

export async function loadChannels(client: Client): Promise<void> {
    const userIds = client.users.cache.map((user) => user.id);

    const foundUsers = (await userSchema.find({ _id: { $in: userIds } })) as [
        userInterface
    ];

    for (const user of foundUsers) {
        if (
            !user.channels ||
            !user.channels.gpteChat ||
            !user.channels.gpteChat.chat ||
            user.channels.gpteChat.chat.length <= 0
        )
            continue;
        channels[user._id] = user.channels.gpteChat.chat.map((ch) => {
            return {
                serverId: ch.serverId,
                channelId: ch.channelId,
                threadId: ch.threadId,
                model: ch.model,
            };
        });
    }
}

export function setUserChannel(
    user: User,
    data: {
        serverId: string;
        channelId: string;
        threadId: string;
        model: string;
    }
) {
    if (!channels[user.id]) channels[user.id] = [];
    channels[user.id].push(data);
}

export default (user: User, channel: GuildChannel) => {
    if (!channels[user.id]) return false;
    const getChannel: boolean = channels[user.id]
        .filter((ch: { serverId: string }) => ch.serverId === channel.guild.id)
        .map((ch: { channelId: string; threadId: string }) => {
            const isThread = channel.type === ChannelType.PublicThread;
            if (isThread) {
                const isRightChannel = channel.id === ch.threadId;
                if (isRightChannel) return true;
                else return false;
            } else return false;
        })
        .filter((ch: boolean) => ch === true)[0];

    return getChannel;
};
