import {
    ActionRowBuilder,
    Client,
    CommandInteraction,
    EmbedBuilder,
    StringSelectMenuBuilder,
    User,
} from "discord.js";
import WOKCommands, {
    Command,
    CommandObject,
    CommandType,
} from "@tockawa/wokcommands/";
import handleOptedOut from "../configs/database/functions/handleOptedOut";

export default {
    type: CommandType.SLASH,
    category: "Utilities",
    description: "Shows the help menu",
    descriptionLocalizations: {
        "en-US": "Shows the help menu",
        "pt-BR": "Mostra o menu de ajuda",
    },
    nameLocalizations: {
        "pt-BR": "ajuda",
    },

    callback: async ({
        client,
        interaction,
        user,
    }: {
        client: Client;
        interaction: CommandInteraction;
        user: User;
    }) => {
        if (await handleOptedOut(user)) {
            return await interaction.reply(
                "You opted out of this bot, you cannot use any features I have avaiable. And yes, this does include the help menu.\nIf you want to opt back in, use the `/opt` command."
            );
        }

        const categories = ["AI", "Configuration", "Credits"];
        const emojis = ["🤖", "⚙️", "📜"];

        return await interaction.reply({
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
                        client.translate(user, "help", "helpDescription")
                    )
                    .setFooter({
                        text: client
                            .translate(user, "help", "helpFooter")
                            .replace(
                                "%botOwner%",
                                client.users.cache.get("876578406144290866")!
                                    .tag
                            ),
                        iconURL: client.users.cache
                            .get("876578406144290866")!
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
    },
} as CommandObject;
