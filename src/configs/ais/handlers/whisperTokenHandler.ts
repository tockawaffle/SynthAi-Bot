import { CommandInteraction } from "discord.js";

import userSchema from "../../database/models/userSchema";
import moment from "moment";

export default async (interaction: CommandInteraction, videoLength: string) => {
    const { client, user } = interaction;
    const getMinutesLeft = await userSchema.findOne(
        { _id: user.id },
        { artificialInteligence: { whisper: { avaiableUsage: 1 } } }
    );
    if (!getMinutesLeft) {
        await interaction.editReply(
            client.translate(user, "defaults", "missingDb")
        );
        return false;
    }
    const minutesLeft =
        getMinutesLeft!.artificialInteligence.whisper.avaiableUsage;

    const minutesLeftAfter =
        minutesLeft - Math.round(parseInt(videoLength) / 60);

    if (minutesLeftAfter < 0) {
        await interaction.editReply(
            client
                .translate(user, "tokens", "whisperNET")
                .replace("%s", minutesLeft.toString())
                .replace(
                    "%t",
                    Math.round(parseInt(videoLength) / 60).toString()
                )
        );
        return false;
    }

    try {
        const updateMinutes = await userSchema.findOneAndUpdate(
            { _id: user.id },
            {
                $set: {
                    "artificialInteligence.whisper.avaiableUsage":
                        minutesLeftAfter,
                },
            },
            { upsert: true }
        );

        if (!updateMinutes) {
            await interaction.editReply(
                client.translate(user, "defaults", "missingDb")
            );
            return false;
        } else return true;
    } catch (e) {
        await interaction.editReply(client.translate(user, "defaults", "dbError"));
        return false;
    }
};
