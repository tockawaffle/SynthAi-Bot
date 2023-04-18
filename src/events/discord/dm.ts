import { ChannelType, Client, DMChannel, Events, Message } from "discord.js";

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message, client: Client) {
        const { author, channel, guild } = message;
        if (author.bot) return;
        if (channel.type !== ChannelType.DM) return;

        await message.channel.sendTyping();

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

            const flagsString = flagsArray.map((flag) => flag[0]).join(", ");

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

        const messages = await (message.channel as DMChannel).messages.fetch({
            limit: 25,
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
                    }, created by ${client.application!.owner}.`,
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
    },
};
