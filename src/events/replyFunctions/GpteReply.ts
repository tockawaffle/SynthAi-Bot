import { client } from "../../bot";
import { Message } from "discord.js";
import moderate from "../__dev/moderation";
import tokenHandler from "../../configs/ais/handlers/gptTokenHandler";
import DuckDuckGoSearch from "../../configs/ais/chatBased/gpte/duckduckgo";
import handleMessageMemory from "../../configs/ais/handlers/handleMessageMemory";
import { TextChannel, EmbedBuilder } from "discord.js";
import axios from "axios";
import switcher from "../../configs/commands/ais/ethernet/switcher";

export default async function (message: Message, hasOptedOut: boolean) {
    const { author } = message;
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

        const messagesArrayContent = messagesArray
            .map((m) => m.content)
            .reverse();

        const startRequisition = Date.now();

        let content: string = "";
        const toggler = await switcher();
        if (toggler) {
            const reply = await axios.get(process.env.PROXY_API + "/ask", {
                params: {
                    prompt: message.content,
                    model: "you",
                },
            });

            const endRequisition = Date.now();
            const requisitionTimeSeconds =
                (endRequisition - startRequisition) / 1000;

            content = `${reply.data.text}\n\n\`\`\`⏳ ${requisitionTimeSeconds}s\`\`\``;
        } else {
            const gpt = await client.gpte.createChatCompletionPlugin({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: message.content,
                    },
                    {
                        role: "assistant",
                        content: messagesArrayContent.join("\n"),
                    },
                ],
                plugins: { DuckDuckGoSearch },
            });

            const endRequisition = Date.now();
            const requisitionTimeSeconds =
                (endRequisition - startRequisition) / 1000;

            const response = gpt.choices
                .map(
                    (choice: { message: { content: any } }) =>
                        choice.message?.content
                )
                .filter(Boolean)[0];

            content = `${response}\n\n\`\`\`${
                gpt.usage!.total_tokens
            } Tokens -⏳ ${requisitionTimeSeconds}s\`\`\``;
        }

        return await message.channel.send({
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
}
