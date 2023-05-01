import {
    Client,
    EmbedBuilder,
    Events,
    Interaction,
    Message,
    TextChannel,
} from "discord.js";

import GptChannels from "../../configs/database/functions/GptChannels";
import BingChannels from "../../configs/database/functions/BingChannel";
import GpteChannels from "../../configs/database/functions/GpteChannels";
// import updateFollowUp from "../../configs/ais/bing/updateFollowUp";

import moderate from "../__dev/moderation";

import handleOptedOut from "../../configs/database/functions/handleOptedOut";

import tokenHandler from "../../configs/ais/handlers/gptTokenHandler";
import handleMessageMemory from "../../configs/ais/handlers/handleMessageMemory";

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message, client: Client) {
        const { author, channel, guild } = message;

        const hasOptedOut = await handleOptedOut(author);

        if (author.bot) return;
        if (!guild) return;

        const thisChn = channel as TextChannel;

        const GptShouldReply = GptChannels(author, thisChn);
        const GpteShouldReply = GpteChannels(author, thisChn);
        const BingShouldReply = BingChannels(author, thisChn);

        if (GptShouldReply) {
            if (message.content.length <= 0) return;
            message.channel.sendTyping();

            if (hasOptedOut)
                return await message.reply(
                    "You opted out of this bot, you cannot use any features I have avaiable."
                );

            const token = await tokenHandler(message.content, message);
            if (!token) return;

            const moderation = await moderate(message);
            if (moderation) return;

            const memoryAmount = await handleMessageMemory(author);

            const messages = await (
                message.channel as TextChannel
            ).messages.fetch({ limit: memoryAmount });
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

            await message.channel.send({
                content: gpt.data.choices[0].message?.content,
                reply: {
                    messageReference: message.id,
                },
            });
        } else if (GpteShouldReply) {
            if (message.content.length <= 0) return;
            message.channel.sendTyping();

            if (hasOptedOut)
                return await message.reply(
                    "You opted out of this bot, you cannot use any features I have avaiable."
                );

            const token = await tokenHandler(message.content, message);
            if (!token) return;

            const moderation = await moderate(message);
            if (moderation) return;

            try {
                const get = await client.gpte(
                    "gpt-4",
                    process.env.CF!,
                    process.env.UA!,
                    message.content,
                    true,
                    false
                );
                const {
                    contexts,
                    tokens,
                    model: Model,
                    timeUntilCompletion,
                } = get.details;
                const response = get.response;

                const content = `${response}\n\n**Contexts:** ${contexts}\n**Tokens:** ${tokens}\n**Model:** ${Model}\n**Time Until Completion:** ${timeUntilCompletion}`;

                await message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("GPT-E")
                            .setDescription(content)
                            .setColor("Random")
                            .setTimestamp()
                            .setFooter({
                                text: message.guild!.name,
                                iconURL: message.guild!.iconURL()!,
                            })
                            .setAuthor({
                                name: author.username,
                                iconURL: author.displayAvatarURL()!,
                            }),
                    ],
                    reply: {
                        messageReference: message.id,
                    },
                });
            } catch (error: any) {
                console.log(error);
                return await message.channel.send({
                    content: client
                        .translate(author, "defaults", "apiError")
                        .replace("%e", `\`\`\`${error}\`\`\``),
                });
            }
        } else if (BingShouldReply.shouldReply) {
            if (message.content.length <= 0) return;
            message.channel.sendTyping();

            if (hasOptedOut)
                return await message.reply(
                    "You opted out of this bot, you cannot use any features I have avaiable."
                );

            const moderation = await moderate(message);
            if (moderation) return;

            try {
                const bing = await client.bing.sendMessage(
                    message.content
                    // BingShouldReply.followUp
                );

                /**
                 * @todo Update follow up message, this is not working the way it's intended:
                    await updateFollowUp(
                        bing,
                        author,
                        {
                            serverId: guild!.id,
                            threadId: thisChn.id,
                        },
                        client
                    );
                */

                return await message.channel.send({
                    content: bing.text,
                    reply: {
                        messageReference: message.id,
                    },
                });
            } catch (error: any) {
                console.log(error);
                return await message.channel.send({
                    content: client
                        .translate(author, "defaults", "apiError")
                        .replace("%e", `\`\`\`${error}\`\`\``),
                });
            }
        }
    },
};
