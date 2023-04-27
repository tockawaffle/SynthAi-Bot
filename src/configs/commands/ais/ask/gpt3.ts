import { CommandInteraction } from "discord.js";
import tokenHandler from "../../../ais/handlers/gptTokenHandler";

import moderate from "../../../../events/__dev/moderation";

export default async (interaction: CommandInteraction) => {
    const { user, client } = interaction;

    const topic = interaction.options.get("question", true).value as string;

    await interaction.deferReply();

    const token = await tokenHandler(topic, interaction);
    if (!token) return;

    const moderation = await moderate(interaction, topic);
    if (moderation) return;

    const gpt = await client.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: topic,
            },
            {
                role: "system",
                content: client.gptSystem(user, client, "ask"),
            },
        ],
        max_tokens: 512,
        user: user.id,
    });

    await interaction.editReply({
        content: gpt.data.choices[0].message!.content,
    });
};
