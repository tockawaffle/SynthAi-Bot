import { Message, TextChannel } from "discord.js";
import personalityChanger from "../__dev/personalityChanger";

export default async function (
    message: Message,
    hasOptedOut: boolean,
    personality: string
) {
    const { author, client, channel } = message;
    if (message.content.length <= 0) return;
    message.channel.sendTyping();

    if (hasOptedOut)
        return await message.reply(
            "You opted out of this bot, you cannot use any features I have avaiable."
        );

    try {
        const messages = await (message.channel as TextChannel).messages.fetch({
            limit: 5,
        });
        const messagesArray = messages.filter((m) => {
            if (m.author.id === author.id) {
                m.content = `${author.username}: ${m.content}`;
                return m.content;
            }

            if (m.author.id === client.user?.id) {
                m.content = `Mapple: ${m.content}`;
                return m.content;
            }
            return;
        });

        const messagesArrayContent = messagesArray
            .map((m) => m.content)
            .reverse();

        const personalityChange = await personalityChanger(
            personality as "mapple"
        );
        
        const davinci = await client.gpte.createCompletion({
            model: "text-davinci-003",
            prompt: `System: ${personalityChange}\n${messagesArrayContent.join("\n")}\n${author.username}: ${message.content}\nMapple:`,
            temperature: 0.7,
            max_tokens: 512,
            frequency_penalty: 0,
            presence_penalty: 0,
            top_p: 1,
            user: author.id,
        });

        const content = davinci.data.choices[0]!.text!;

        return await channel.send({
            content: content
                .replace(/User: /g, "")
                .replace(/Bot: /g, "")
                .replace(/Mapple: /g, ""),
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
