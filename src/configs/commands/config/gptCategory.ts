import {
    Client,
    CommandInteraction,
    GuildBasedChannel,
    GuildMember,
    PermissionFlagsBits,
} from "discord.js";

import serverSchema from "../../database/models/serverSchema";
import checkPerms from "../../validators/commands/runtime/checkPerms";
import checkGuild from "../../validators/commands/runtime/checkGuild";

export default async function (interaction: CommandInteraction) {
    const { member, guild, user, client } = interaction;
    const { translate } = client as Client;

    if (
        !checkPerms(member as GuildMember, PermissionFlagsBits.ManageChannels)
    ) {
        return await interaction.reply({
            content: translate(user, "defaults", "noPerms").replace(
                "%s",
                "Manage Channels"
            ),
        });
    }

    if (!checkGuild(interaction))
        return await interaction.reply({
            content: translate(user, "defaults", "guildOnly"),
        });

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
