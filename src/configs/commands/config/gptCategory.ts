import {
    Client,
    CommandInteraction,
    GuildBasedChannel,
    PermissionFlagsBits,
} from "discord.js";

import serverSchema from "../../database/models/serverSchema";
import checkPerms from "../../validators/commands/runtime/checkPerms";
import checkGuild from "../../validators/commands/runtime/checkGuild";
import optedOut from "../../database/models/optedOut";

export default async function (interaction: CommandInteraction) {
    const { guild, user, client } = interaction;

    const isOptedOut = await optedOut.findOne({ _id: "optedOut", ids: { $in: [user.id] } })
    if (isOptedOut) {
        return await interaction.reply({
            content:
                "You have opted out of the bot. You cannot use any features I have until you opt back in.",
            ephemeral: true,
        });
    }

    const { translate } = client as Client;

    if (!checkGuild(interaction))
        return await interaction.reply({
            content: translate(user, "defaults", "guildOnly"),
        });

    const botPerms = await checkPerms(
        interaction,
        [PermissionFlagsBits.ManageChannels],
        "bot"
    );
    if (!botPerms) return;

    const userPerms = await checkPerms(
        interaction,
        [PermissionFlagsBits.ManageChannels],
        "user"
    );
    if (!userPerms) return;

    const gptCategory = interaction.options.get("category", true)
        .value as string;
    const checkCategory = guild!.channels.cache.get(
        gptCategory
    ) as GuildBasedChannel;

    if (checkCategory.type !== 4) {
        return await interaction.reply({
            content: translate(user, "config", "invalidCategory").replace(
                "%s",
                `${checkCategory}`
            ),
        });
    } else {
        const server = await serverSchema.findOne({
            _id: guild!.id,
        });

        if (server) {
            await serverSchema.findOneAndUpdate(
                { _id: guild!.id },
                {
                    $set: {
                        "channels.gptCategory": gptCategory,
                    },
                },
                { upsert: true }
            );

            return await interaction.reply({
                content: translate(user, "config", "gptCategorySet").replace(
                    "%s",
                    `${checkCategory}`
                ),
            });
        } else {
            return await interaction.reply({
                content: translate(user, "config", "missingServer"),
            });
        }
    }
}
