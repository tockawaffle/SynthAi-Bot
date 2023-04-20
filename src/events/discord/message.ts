import { Client, Events, Interaction, Message, TextChannel } from "discord.js";

import GptChannels from "../../configs/database/functions/GptChannels";
import BingChannels from "../../configs/database/functions/BingChannel";
// import updateFollowUp from "../../configs/ais/bing/updateFollowUp";

import handleOptedOut from "../../configs/database/functions/handleOptedOut";

import tokenHandler from "../../configs/ais/handlers/tokenHandler";

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message, client: Client) {
        const { author, channel, guild } = message;

        if (await handleOptedOut(author)) {
            return await message.reply(
                "You opted out of this bot, you cannot use any features I have avaiable."
            );
        }

        if (author.bot) return;
        if (!guild) return;

        const thisChn = channel as TextChannel;

        const GptShouldReply = GptChannels(author, thisChn);
        const BingShouldReply = BingChannels(author, thisChn);

        if (GptShouldReply) {
            if (message.content.length <= 0) return;
            message.channel.sendTyping();

            const token = await tokenHandler(message.content, message);
            if (!token) return;

            const moderation = (
                await client.gpt.createModeration({
                    model: "text-moderation-latest",
                    input: message.content,
                })
            ).data.results[0];

            if (moderation.flagged) {
                const flags = moderation.categories as {
                    sexual: boolean;
                    hate: boolean;
                    violence: boolean;
                    "self-harm": boolean;
                    "sexual/minors": boolean;
                    "hate/threatening": boolean;
                    "violence/graphic": boolean;
                };

                const flagsArray = Object.entries(flags).filter(
                    (flag) => flag[1] === true
                );

                const flagsString = flagsArray
                    .map((flag) => flag[0])
                    .join(", ");

                return message.channel.send({
                    content: `${client.translate(
                        author,
                        "defaults",
                        "moderationFlagged"
                    )} ${flagsString}.`,
                    reply: {
                        messageReference: message.id,
                    },
                });
            }

            const messages = await (
                message.channel as TextChannel
            ).messages.fetch({ limit: 25 });
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

            const gpt = await client.gpt.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: message.content,
                    },
                    {
                        role: "system",
                        content: `You are chatting with ${
                            author.username
                        }, answer the user precisely and in their language input. Do not use any prefixes at the start of messages. You are on Discord, integrated via your API. The bot's name is ${
                            client.user!.username
                        }, created and developed by ${
                            client.users.cache.get("876578406144290866")!
                                .username
                        }.`,
                    },
                    {
                        role: "assistant",
                        content: messagesArrayContent.join("\n"),
                    },
                ],
                max_tokens: 250,
            });

            await message.channel.send({
                content: gpt.data.choices[0].message?.content,
                reply: {
                    messageReference: message.id,
                },
            });
        } else if (BingShouldReply.shouldReply) {
            if (message.content.length <= 0) return;
            message.channel.sendTyping();

            const moderation = (
                await client.gpt.createModeration({
                    model: "text-moderation-latest",
                    input: message.content,
                })
            ).data.results[0];

            if (moderation.flagged) {
                const flags = moderation.categories as {
                    sexual: boolean;
                    hate: boolean;
                    violence: boolean;
                    "self-harm": boolean;
                    "sexual/minors": boolean;
                    "hate/threatening": boolean;
                    "violence/graphic": boolean;
                };

                const flagsArray = Object.entries(flags).filter(
                    (flag) => flag[1] === true
                );

                const flagsString = flagsArray
                    .map((flag) => flag[0])
                    .join(", ");

                return message.channel.send({
                    content: `${client.translate(
                        author,
                        "defaults",
                        "moderationFlagged"
                    )} ${flagsString}.`,
                    reply: {
                        messageReference: message.id,
                    },
                });
            }

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
        } else return;
    },
};
