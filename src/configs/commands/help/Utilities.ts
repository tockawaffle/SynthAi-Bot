import WOK, { Command } from "@tockawa/wokcommands";
import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
} from "discord.js";
import returnCat from "./functions/returnCat";

export default async (menu: StringSelectMenuInteraction, instance: WOK) => {
    const { user, client } = menu;

    const Utils = await returnCat(instance, user, "Utilities");

    const categories = ["AI", "Configuration", "Credits", "FAQ", "Main Page"];
    const emojis = ["🤖", "⚙️", "📜", "🗂️", "🏠"];

    return await menu.update({
        embeds: [
            new EmbedBuilder()
                .setTitle(client.translate(user, "help", "utilsCatTitle"))
                .setDescription(
                    Utils.map((command) => {
                        let options = command.options?.map((option) => {
                            return `\n${option.name} - ${option.description}`;
                        });

                        if (!options) options = [""];

                        return `\n\`\`\`${command.name} - ${
                            command.description
                        }\n\n${client.translate(
                            user,
                            "help",
                            "aiCatOp"
                        )}\n${options}\`\`\``;
                    }).join("\n")
                )
                .setColor("Random")
                .setTimestamp()
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
                .setAuthor({
                    name: client.user!.username,
                    iconURL: client.user!.displayAvatarURL(),
                }),
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
    });
};
