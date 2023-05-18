import { GuildChannel, Message, TextChannel } from "discord.js";
import moderate from "../__dev/moderation";

export default async function (message: Message, hasOptedOut: boolean) {
    const { author, client, channel } = message;
    if (message.content.length <= 0) return;
    message.channel.sendTyping();

    if (hasOptedOut) {
        return await message.reply(
            "You opted out of this bot, you cannot use any features I have avaiable."
        );
    }

    const channelName = (channel as GuildChannel).name;
    const moderation = await moderate(message);
    if (moderation) return;

    const bard: string = await client.bard.ask(message.content, channelName);

    return await message.channel.send({
        content: bard,
        reply: {
            messageReference: message.id,
        },
    });
}
