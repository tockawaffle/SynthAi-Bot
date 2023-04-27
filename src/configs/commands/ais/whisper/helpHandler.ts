import { CommandInteraction, EmbedBuilder } from "discord.js";

export default async (interaction: CommandInteraction) => {
    const { user, client } = interaction;

    const SubCommand = {
        TRANSCRIBE: "transcribe",
        TRANSLATE: "translate",
    };

    const subCommandName = interaction.options.data[0].options![0]
        .name as keyof typeof SubCommand;

    switch (subCommandName) {
        case SubCommand.TRANSCRIBE: {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(
                            client.translate(
                                user,
                                "whisper",
                                "helpDescTranscribe"
                            )
                        )
                        .setFooter({
                            text: user.username,
                            iconURL: user.displayAvatarURL(),
                        })
                        .setTimestamp(),
                ],
            });
            break;
        }
        case SubCommand.TRANSLATE: {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL(),
                        })
                        .setDescription(
                            client.translate(
                                user,
                                "whisper",
                                "helpDescTranslate"
                            )
                        )
                        .setFooter({
                            text: user.username,
                            iconURL: user.displayAvatarURL(),
                        })
                        .setTimestamp(),
                ],
            });
            break;
        }
    }
};
