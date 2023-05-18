import { CommandInteraction } from "discord.js";
import tokenHandler from "../../../ais/handlers/gptTokenHandler";

import moderate from "../../../../events/__dev/moderation";
import axios from "axios";
import DuckDuckGoSearch from "../../../ais/chatBased/gpte/duckduckgo";
import switcher from "../ethernet/switcher";

export default async (interaction: CommandInteraction) => {
    const { client } = interaction;

    const topic = interaction.options.get("question", true).value as string;

    await interaction.deferReply({ ephemeral: true});

    const token = await tokenHandler(topic, interaction);
    if (!token) return;

    const moderation = await moderate(interaction, topic);
    if (moderation) return;

    const startRequisition = Date.now();
    let content: string = "";
    const toggler = await switcher();
    if (toggler) {
        const reply = await axios.get(process.env.GPTE_API + "/ask", {
            params: {
                prompt: topic,
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
                    content: topic,
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

    await interaction.editReply({
        content
    });
};
