import { CommandInteraction, GuildChannel } from "discord.js";
import moderate from "../../../../../events/__dev/moderation";
import dalleTokenHandler from "../../../../ais/handlers/dalleTokenHandler";
import customModeration from "./customModeration";

export default async (interaction: CommandInteraction) => {
    const { user, client } = interaction;
    const prompt = interaction.options.get("prompt", true).value as string;
    const size = interaction.options.get("size", true).value as string as
        | "256x256"
        | "512x512"
        | "1024x1024";

    const moderation = await moderate(interaction, prompt);
    if (moderation) return;

    const secondMod = await customModeration(
        prompt,
        interaction.channel as GuildChannel
    );
    if (secondMod)
        return await interaction.reply({
            content: client
                .translate(user, "image", "customModeration")
                .replace("%w", secondMod.word)
                .replace("%r", secondMod.reason)
                .replace("%g", secondMod.gravity.toString()),
            ephemeral: true,
        });

    const token = await dalleTokenHandler(interaction, size);
    if (!token) return;

    await interaction.deferReply();

    try {
        const image = await client.openai.createImage({
            prompt,
            size,
            n: 4,
            response_format: "b64_json",
            user: user.id,
        });

        const images = image.data as {
            created: number;
            data: [{ b64_json: string }];
        };
        const imagesData = images.data;

        await interaction.editReply({
            content: `**${prompt}**`,
            files: imagesData.map((imageData) => ({
                attachment: Buffer.from(imageData.b64_json, "base64"),
                name: `${images.created}.png`,
            })),
        });
    } catch (error: any) {
        return await interaction.editReply({
            content: client
                .translate(user, "image", "openAiErrored")
                .replace("%s", error.message),
        });
    }
};
