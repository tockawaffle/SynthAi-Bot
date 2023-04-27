import WOK, { Command } from "@tockawa/wokcommands";
import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
} from "discord.js";

export default async (menu: StringSelectMenuInteraction) => {
    const { user, client } = menu;

    const categories = ["AI", "Configuration", "Main Page"];
    const emojis = ["🤖", "⚙️", "🏠"];

    return await menu.reply({
        embeds: [
            new EmbedBuilder()
                .setAuthor({
                    name: client.user!.username,
                    iconURL: client.user!.displayAvatarURL(),
                })
                .setTitle(
                    client
                        .translate(user, "help", "helpTitle")
                        .replace("%botName%", client.user!.username)
                )
                .setDescription(
                    client.translate(user, "help", "creditsCatDesc")
                )
                .setFooter({
                    text: client
                        .translate(user, "help", "helpFooter")
                        .replace(
                            "%botOwner%",
                            client.users.cache.get(process.env.OWNER_ID!)!.tag
                        ),
                    iconURL: client.users.cache
                        .get(process.env.OWNER_ID!)!
                        .displayAvatarURL(),
                })
                .setColor("Random")
                .setTimestamp(),
        ],
        components: [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("helpMenu")
                    .setPlaceholder(
                        client.translate(user, "help", "helpPlaceholder")
                    )
                    .addOptions(
                        categories.map((category) => ({
                            label: client.translate(user, "help", category),
                            value: category,
                            description: client.translate(
                                user,
                                "help",
                                `${category.toLowerCase()}Description`
                            ),
                            emoji: emojis[categories.indexOf(category)],
                        }))
                    )
            ) as ActionRowBuilder<StringSelectMenuBuilder>,
        ],
        ephemeral: true,
    });
};
