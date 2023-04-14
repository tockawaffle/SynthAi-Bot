import {
    CommandInteraction,
    GuildBasedChannel,
    GuildMember,
    PermissionFlagsBits,
} from "discord.js";

import serverSchema from "../../../database/models/serverSchema";
import checkPerms from "../../../validators/commands/runtime/checkPerms";

export default async function (interaction: CommandInteraction) {
    const { member, guild, user, client } = interaction;

    if (
        !checkPerms(member as GuildMember, PermissionFlagsBits.ManageChannels)
    ) {
        return await interaction.reply({
            content: client
                .translate(user, "defaults", "noPerms")
                .replace("%s", "Manage Channels"),
        });
    }

    const gptCategory = interaction.options.get("gpt-category", true)
        .value as string;
    const checkCategory = guild!.channels.cache.get(
        gptCategory
    ) as GuildBasedChannel;

    if (checkCategory.type !== 4) {
        return await interaction.reply({
            content: client
                .translate(user, "config", "invalidCategory")
                .replace("%s", `${checkCategory}`),
        });
    } else {
        const server = await serverSchema.findOne({
            _id: guild!.id,
        });

        if (server) {
            server.markModified("channels.gptCategory");
            server.channels.gptCategory = gptCategory;
            await server.save();

            return await interaction.reply({
                content: client
                    .translate(user, "config", "gptCategorySet")
                    .replace("%s", `${checkCategory}`),
            });
        }
    }
}
