import { GuildMember, PermissionResolvable, User } from "discord.js";

export default async function (
    guildMember: GuildMember,
    permission: PermissionResolvable
) {
    if (guildMember.permissions.has(permission, true)) return true;
    else return false;
}
