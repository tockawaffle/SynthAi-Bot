import { ChannelType, Client, DMChannel, Events, Message } from "discord.js";

import moderate from "../__dev/moderation";

import tokenHandler from "../../configs/ais/handlers/gptTokenHandler";
import handleMessageMemory from "../../configs/ais/handlers/handleMessageMemory";
import handleSpecific from "../__dev/handleSpecific";
import optedOut from "../../configs/database/models/optedOut";

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message, client: Client) {
        const { author, channel, guild } = message;
        if (author.bot) return;
        if (channel.type !== ChannelType.DM) return;

        const isOptedOut = await optedOut.findOne({ _id: author.id });
        if (isOptedOut) {
            return await message.reply({
                content:
                    "You have opted out of the bot. You cannot use any features I have until you opt back in.",
            });
        }

        await message.channel.sendTyping();

        const devCommandsHandler = await handleSpecific(author, message);
        if (devCommandsHandler) return;

        const token = await tokenHandler(message.content, message);
        if (!token) return;

        const moderation = await moderate(message);
        if (moderation) return;

        const memoryAmount = await handleMessageMemory(author);

        const messages = await (message.channel as DMChannel).messages.fetch({
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

        const messagesArrayContent = messagesArray
            .map((m) => m.content)
            .reverse();

        const gpt = await client.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: message.content,
                },
                {
                    role: "system",
                    content: client.gptSystem(author, client, "dm"),
                },
                {
                    role: "assistant",
                    content: messagesArrayContent.join("\n"),
                },
            ],
            max_tokens: 512,
            user: author.id,
        });

        await message.channel.send({
            content: gpt.data.choices[0].message?.content,
            reply: {
                messageReference: message.id,
            },
        });
    },
};
