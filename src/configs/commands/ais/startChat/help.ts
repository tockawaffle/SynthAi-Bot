import { CommandInteraction, EmbedBuilder } from "discord.js";

export default async function (interaction: CommandInteraction) {
    const { client, guild, user } = interaction;

    return await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()!,
                })
                .setTitle("Help")
                .setDescription(client.translate(user, "startChat", "help"))
                .setColor("Random")
                .setTimestamp()
                .setFooter({
                    text: guild!.name,
                    iconURL: guild!.iconURL()!,
                }),
        ],
    });
}
