import { GuildChannel, TextChannel } from "discord.js";
import words from "./words.json";

export default async (content: string, channel: GuildChannel) => {
    const w = words.words as [
        { word: string; action: "flag"; reason: string; gravity: number }
    ];

    let flagData = {
        word: "",
        flagged: false,
        reason: "",
        gravity: 0,
        nsfw: false,
    };

    w.some((wordData) => {
        const textChannel = channel as TextChannel;
        if (textChannel.nsfw) {
            flagData = {
                word: "",
                flagged: false,
                reason: "",
                gravity: 0,
                nsfw: true,
            };
            return false;
        } else {
            if (content.includes(wordData.word)) {
                flagData = {
                    word: wordData.word,
                    flagged: true,
                    reason: wordData.reason,
                    gravity: wordData.gravity,
                    nsfw: false,
                };
                return true;
            }
            return false;
        }
    });

    return flagData;
};
