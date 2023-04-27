import { CommandInteraction, PermissionsBitField } from "discord.js";
import { client } from "../../../../bot";

export default async function (
    interaction: CommandInteraction,
    permissions: bigint[],
    type: "user" | "bot",
    customString?: string
) {
    switch (type) {
        case "user": {
            const user = interaction.guild!.members.cache.get(
                interaction.user.id
            )!;

            const botMissingPerms = permissions.filter(
                (perm) => !user.permissions.has(perm)
            );

            if (botMissingPerms.length > 0) {
                const missingPermsList = botMissingPerms
                    .map((perm) =>
                        new PermissionsBitField(perm).toArray().join(", ")
                    )
                    .join(", ");

                await interaction.reply({
                    content: client
                        .translate(interaction.user, "defaults", customString ?? "noPermsBot")
                        .replace("%ss", missingPermsList),
                    ephemeral: true,
                });
                return false;
            } else return true;
        }
        case "bot": {
            const botMember = interaction.guild!.members.cache.get(
                interaction.client.user.id
            )!;

            const botMissingPerms = permissions.filter(
                (perm) => !botMember.permissions.has(perm)
            );

            if (botMissingPerms.length > 0) {
                const missingPermsList = botMissingPerms
                    .map((perm) =>
                        new PermissionsBitField(perm).toArray().join(", ")
                    )
                    .join(", ");
                await interaction.reply({
                    content: client
                        .translate(interaction.user, "defaults", customString ?? "noPermsUser")
                        .replace("%ss", missingPermsList),
                    ephemeral: true,
                });
                return false;
            } else return true;
        }
    }
}
