import { CommandInteraction } from "discord.js";

import optedOut from "../../database/models/optedOut";
import { loadUserSettings } from "../../languages/lang";

export default async (interaction: CommandInteraction) => {
    const { user, client } = interaction;

    const ifOptedOut = await optedOut.find();
    const findUser: string[] = ifOptedOut.map((user) => user.ids).flat();

    if (findUser.includes(user.id)) {
        await optedOut.updateOne(
            { _id: "optedOut" },
            { $pull: { ids: user.id } }
        );
        await loadUserSettings(client);

        return await interaction.reply({
            content: client.translate(user, "opt", "changedOut"),
            ephemeral: true,
        });
    } else {
        return await interaction.reply({
            content: client.translate(user, "opt", "unchangedIn"),
            ephemeral: true,
        });
    }
};
