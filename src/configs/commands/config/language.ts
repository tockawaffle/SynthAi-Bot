import { Client, CommandInteraction, EmbedBuilder } from "discord.js";

import lang from "../../languages/lang";
import langJson from "../../languages/translations.json";

import userSchema from "../../database/models/userSchema";
import optedOut from "../../database/models/optedOut";

export default async (
    interaction: CommandInteraction,
    lang: "english" | "portugues"
) => {
    const { client, user } = interaction;

    const isOptedOut = await optedOut.findOne({
        _id: "optedOut",
        ids: { $in: [user.id] },
    });
    if (isOptedOut) {
        return await interaction.reply({
            content:
                "You have opted out of the bot. You cannot use any features I have until you opt back in.",
            ephemeral: true,
        });
    }

    const { loadUser, setLanguage, translate } = client as Client;

    if (!langJson.languages.includes(lang)) {
        return await interaction.reply({
            content: translate(user, "config", "invalidLang").replace(
                "%s",
                lang
            ),
            ephemeral: true,
        });
    } else {
        await userSchema.findOneAndUpdate(
            { _id: user.id },
            {
                _id: user.id,
                accountSettings: {
                    language: lang,
                },
            }
        );
        setLanguage(user, lang);
        await loadUser(client);

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(translate(user, "config", "langTitle"))
                    .setColor("Green")
                    .setDescription(
                        translate(user, "config", "langDescription").replace(
                            "%s",
                            lang
                        )
                    )
                    .setTimestamp()
                    .setAuthor({
                        name: user.tag,
                        iconURL: user.displayAvatarURL(),
                    })
                    .setFooter({
                        text: translate(user, "defaults", "madeBy"),
                        iconURL: client.user.displayAvatarURL(),
                    }),
            ],
            ephemeral: true,
        });
    }
};
