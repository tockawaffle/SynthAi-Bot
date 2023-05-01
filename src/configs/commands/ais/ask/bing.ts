import { CommandInteraction } from "discord.js";

import moderate from "../../../../events/__dev/moderation";

export default async (interaction: CommandInteraction) => {
    const { client, user } = interaction;

    try {
        const topic = (await interaction.options.get("question", true)
            .value) as string;

        await interaction.deferReply({ ephemeral: true });

        const moderation = await moderate(interaction, topic);
        if (moderation) return;

        const bing = await client.bing.sendMessage(topic);

        await interaction.editReply({
            content: bing.text,
        });
    } catch (error: any) {
        const code: number = error.code;
        const errorMessage: string = error.rawError.message;

        switch (code) {
            case 50006: {
                return await interaction.editReply({
                    content: client
                        .translate(user, "ask", "errorApi")
                        .replace("%ec", code.toString())
                        .replace("%em", errorMessage),
                });
            }
            default: {
                return await interaction.editReply({
                    content: client
                        .translate(user, "ask", "errorApi")
                        .replace("%ec", code.toString())
                        .replace("%em", errorMessage),
                });
            }
        }
    }
};
