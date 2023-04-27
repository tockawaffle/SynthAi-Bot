import { Client, CommandInteraction, Message, User } from "discord.js";

export default async function moderate(
    message: Message | CommandInteraction,
    interactionContent?: string
): Promise<boolean> {
    let author: User, client: Client, content: string;
    if (message instanceof Message) {
        author = message.author;
        client = message.client;
        content = message.content;
    } else {
        author = message.user;
        client = message.client;
        if (!interactionContent) {
            console.log("No interaction content provided for moderation, bypassing...")
            return false;
        } else {
            content = interactionContent!;
        }
    }

    const moderation = (
        await client.openai.createModeration({
            model: "text-moderation-latest",
            input: content,
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

        message.reply({
            content: `${client.translate(
                author,
                "defaults",
                "moderationFlagged"
            )} ${flagsString}.`,
        });
        return true;
    } else return false;
}
