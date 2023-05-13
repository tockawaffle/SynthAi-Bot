import { CommandInteraction, GuildMember, Message, PermissionsBitField, User } from "discord.js";
import { client } from "../../../../bot";

export default async function (
    interaction: CommandInteraction | Message,
    permissions: bigint[],
    type: "user" | "bot",
    customString?: string
) {

    let guildMember: GuildMember;
    let userMember: User
    if (interaction instanceof Message) {
        guildMember = interaction.guild!.members.cache.get(
            interaction.author.id
        )!;
        userMember = interaction.author
    } else {
        guildMember = interaction.member! as GuildMember;
        userMember = interaction.user
    }

    switch (type) {
        case "user": {
            const user = interaction.guild!.members.cache.get(
                guildMember.id
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
                        .translate(userMember, "defaults", customString ?? "noPermsUser")
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
                try {
                    await interaction.reply({
                        content: client
                            .translate(userMember, "defaults", customString ?? "noPermsBot")
                            .replace("%ss", missingPermsList),
                        ephemeral: true,
                    });
                } catch (error) {
                    await interaction.channel!.send({
                        content: client
                            .translate(userMember, "defaults", customString ?? "noPermsBot")
                            .replace("%ss", missingPermsList),
                    })
                }
                return false;
            } else return true;
        }
    }
}
