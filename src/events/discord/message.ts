import {
    Client,
    Events,
    Message,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";

import GptChannels from "../../configs/database/functions/GptChannels";
import GpteChannels from "../../configs/database/functions/GpteChannels";
import CustomChannels from "../../configs/database/functions/CustomChannels";

import GptReply from "../replyFunctions/GptReply";
import GpteReply from "../replyFunctions/GpteReply";

import handleOptedOut from "../../configs/database/functions/handleOptedOut";
import checkPerms from "../../configs/validators/commands/runtime/checkPerms";
import CustomReply from "../replyFunctions/CustomReply";

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message, client: Client) {
        const { author, channel, guild } = message;

        const hasOptedOut = await handleOptedOut(author);

        if (author.bot) return;
        if (!guild) return;

        const perms = await checkPerms(
            message,
            [
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.UseExternalEmojis,
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.SendMessagesInThreads,
            ],
            "bot",
            "noPermsBot"
        );

        if (!perms) return;

        const thisChn = channel as TextChannel;

        const GptShouldReply = GptChannels(author, thisChn);
        const GpteShouldReply = GpteChannels(author, thisChn);
        const CustomShouldReply = CustomChannels(author, thisChn);

        if (GptShouldReply) {
            return await GptReply(message, hasOptedOut);
        } else if (GpteShouldReply) {
            return await GpteReply(message, hasOptedOut);
        } else if (CustomShouldReply) {
            return await CustomReply(message, hasOptedOut, CustomShouldReply.personality);
        }
    },
};
