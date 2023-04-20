import WOK, { Command } from "@tockawa/wokcommands";
import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
} from "discord.js";

export default async (menu: StringSelectMenuInteraction, instance: WOK) => {
    let AI: {
        name: string;
        description: string;
        options?: {
            name: string;
            description: string;
        }[];
    }[] = [];
    const { user, client } = menu;
    let lang: string = user.lang;

    switch (lang) {
        case "english":
            lang = "en-US";
            break;
        case "portugues":
            lang = "pt-BR";
            break;
        default:
            lang = "en-US";
            break;
    }

    const selLang = lang as "en-US" | "pt-BR";

    await instance.commandHandler.commands.forEach((command: Command) => {
        const isAiCategory = command.commandObject.category === "AI";

        if (isAiCategory) {
            const options = command.commandObject.options;
            const commandName =
                command.commandObject.nameLocalizations![selLang] ??
                command.commandName;
            const commandDescription =
                command.commandObject.descriptionLocalizations![selLang] ??
                command.commandObject.description;
            const commandOptions = options?.map((option) => {
                const optionName =
                    option.nameLocalizations![selLang] ?? option.name;
                const optionDescription =
                    option.descriptionLocalizations![selLang] ??
                    option.description;

                return {
                    name: optionName,
                    description: optionDescription,
                };
            });

            AI.push({
                name: commandName,
                description: commandDescription,
                options: commandOptions,
            });
        } else {
            return null;
        }
    });

    const categories = ["Configuration", "Credits", "Main Page"];
    const emojis = ["⚙️", "📜", "🏠"];

    return await menu.update({
        embeds: [
            new EmbedBuilder()
                .setTitle(client.translate(user, "help", "aiCatTitle"))
                .setDescription(
                    AI.map((command) => {
                        const options = command.options?.map((option) => {
                            return `\n${option.name} - ${option.description}`;
                        });

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
                            client.users.cache.get("876578406144290866")!.tag
                        ),
                    iconURL: client.users.cache
                        .get("876578406144290866")!
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
