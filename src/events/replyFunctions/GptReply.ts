import { Message, TextChannel } from "discord.js";
import { client } from "../../bot";
import tokenHandler from "../../configs/ais/handlers/gptTokenHandler";
import handleMessageMemory from "../../configs/ais/handlers/handleMessageMemory";
import moderate from "../__dev/moderation";

export default async function (message: Message, hasOptedOut: boolean) {
    const { author } = message;
    if (message.content.length <= 0) return;
    message.channel.sendTyping();

    if (hasOptedOut) {
        return await message.reply(
            "You opted out of this bot, you cannot use any features I have avaiable."
        );
    }

    const token = await tokenHandler(message.content, message);
    if (!token) return;

    const moderation = await moderate(message);
    if (moderation) return;

    const memoryAmount = await handleMessageMemory(author);

    const messages = await (message.channel as TextChannel).messages.fetch({
        limit: memoryAmount,
    });
    const messagesArray = messages.filter((m) => {
        if (m.author.id === author.id) {
            m.content = `User: ${m.content}`;
            return m.content;
        }

        if (m.author.id === client.user?.id) {
            m.content = `Bot: ${m.content}`;
            return m.content;
        }
        return;
    });

    const messagesArrayContent = messagesArray.map((m) => m.content).reverse();

    const gpt = await client.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: message.content,
            },
            {
                role: "system",
                content: client.gptSystem(author, client, "guild"),
            },
            {
                role: "assistant",
                content: messagesArrayContent.join("\n"),
            },
        ],
        max_tokens: 512,
        user: author.id,
    });

    return await message.channel.send({
        content: gpt.data.choices[0].message?.content,
        reply: {
            messageReference: message.id,
        },
    });
}
