import { CommandInteraction } from "discord.js";

import optedOut from "../../database/models/optedOut";
import userSchema from "../../database/models/userSchema";

export default async (interaction: CommandInteraction) => {
    const { user, client } = interaction;

    const ifOptedOut = await optedOut.find({ _id: "optedOut" });
    const findUser: string[] = ifOptedOut.map((user) => user.ids).flat();

    if (findUser.includes(user.id)) {
        return await interaction.reply({
            content: client
                .translate(user, "opt", "unchangedOut")
                .replace("%s", user.id),
            ephemeral: true,
        });
    } else {
        await optedOut.findOneAndUpdate(
            { _id: "optedOut" },
            { $push: { ids: user.id } },
            { upsert: true }
        );

        await userSchema.deleteOne({ _id: user.id });
        
        await client.loadUser(client)

        return await interaction.reply({
            content: client
                .translate(user, "opt", "changedIn")
                .replace("%s", user.id),
            ephemeral: true,
        });
    }
};
