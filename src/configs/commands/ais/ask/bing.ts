import {
    CommandInteraction,
} from "discord.js";

import moderate from "../../../../events/__dev/moderation";

export default async (
    interaction: CommandInteraction,
) => {
    const { client } = interaction;

    const topic = interaction.options.get("question", true).value as string;

    await interaction.deferReply();

    const moderation = await moderate(interaction, topic);
    if (moderation) return;

    const bing = await client.bing.sendMessage(topic);

    await interaction.editReply({
        content: bing.text,
    });
};
