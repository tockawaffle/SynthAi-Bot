import {
    WriteStream,
    createReadStream,
    createWriteStream,
    readFileSync,
    unlinkSync,
    writeFileSync,
} from "fs";
import { CommandInteraction } from "discord.js";
import ytdl from "ytdl-core";
import whisperTokenHandler from "../../../ais/handlers/whisperTokenHandler";

export default async (interaction: CommandInteraction) => {
    const { client, user } = interaction;
    const url = interaction.options.get("url", true).value! as string;

    const prompting: string | undefined = interaction.options.get(
        "prompting",
        false
    )?.value as string;
    const language: string | undefined = interaction.options.get(
        "language",
        false
    )?.value as string;

    await interaction.deferReply();

    const match =
        url.match(
            /^(?:(?:https|http):\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be).*(?<=\/|v\/|u\/|embed\/|shorts\/|watch\?v=)(?<!\/user\/)(?<id>[\w\-]{11})(?=\?|&|$)/
        )?.groups?.id || false;

    if (!match) {
        return await interaction.editReply({
            content: client.translate(user, "whisper", "invalidUrl"),
        });
    } else {
        const options = {
            quality: "highestaudio",
            filter: "audioonly",
        } as ytdl.chooseFormatOptions;
        const getInfo = await ytdl.getInfo(url);
        const duration = getInfo.videoDetails.lengthSeconds;

        const token = await whisperTokenHandler(interaction, duration);
        if (!token) return;

        const writeStream: WriteStream = createWriteStream(
            `./dump/${match}.mp3`
        );

        ytdl.downloadFromInfo(getInfo, options)
            .pipe(writeStream)
            .on("finish", async () => {
                const transcription = await client.openai.createTranscription(
                    // @ts-expect-error: "File" type is a browser-only type, don't know why the openai lib uses it. Documentation shows different usage.
                    // Read here: https://platform.openai.com/docs/api-reference/audio/create
                    createReadStream(`./dump/${match}.mp3`),
                    "whisper-1",
                    prompting,
                    "text",
                    0,
                    language
                );

                writeFileSync(
                    `./dump/${match}.txt`,
                    transcription.data.toString()
                );

                const getFile = readFileSync(`./dump/${match}.txt`);

                await interaction.editReply({
                    content: client.translate(user, "whisper", "successUrl"),
                    files: [
                        {
                            name: `${match}.txt`,
                            attachment: getFile,
                        },
                    ],
                });

                writeStream.close();

                //delete file
                unlinkSync(`./dump/${match}.mp3`);
                unlinkSync(`./dump/${match}.txt`);
                return;
            })
            .on("error", async (err) => {
                await interaction.editReply({
                    content: client
                        .translate(user, "whisper", "error")
                        .replace("%s", err.message),
                });
            });
    }
};
