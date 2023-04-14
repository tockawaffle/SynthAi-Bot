import { Client, Routes } from "discord.js";
import WOK, { Command } from "@tockawa/wokcommands";

export async function checkCommands(client: Client, instance: any) {
    const i = instance as WOK;
    const instanceCommandsArray: string[] = [];
    const instanceCommands = (await i.commandHandler.commands) as Command[];
    instanceCommands.forEach((command: Command) => {
        instanceCommandsArray.push(command.commandName);
    });

    instanceCommands.forEach((command: Command) => {
        const nameLocale = command.commandObject.nameLocalizations!;
        const nameLocaleFiltered = nameLocale["pt-BR"];
        instanceCommandsArray.push(nameLocaleFiltered as string);
    });

    const clientCommands = await client.application!.commands.fetch();
    const guildCommands = client.guilds.cache.map((guild) => {
        const commandName = guild.commands.cache.map((command) => command.name);
        return commandName[0];
    })

    const clientCommandsArray: string[] = [];
    clientCommands.forEach((command) => {
        clientCommandsArray.push(command.name);
    });

    const commandsToDelete = clientCommandsArray.filter(
        (command) => !instanceCommandsArray.includes(command) && !guildCommands.includes(command)
    );

    console.log(commandsToDelete)

    let index = 0;
    if (commandsToDelete.length > 0) {
        for (const command of commandsToDelete) {
            const c = clientCommands.map((commands) => {
                if (commands.name === command) return commands;
            });
            const commandToDelete = c.filter(
                (command) => command !== undefined
            );
            await client.application!.commands.delete(commandToDelete[0]!.id);
            await client.rest
                .delete(
                    Routes.applicationCommand(
                        client.user!.id,
                        commandToDelete[0]!.id
                    )
                )
                .catch(async (err) => {
                    if (err.code === 404) {
                        await client.rest.delete(
                            Routes.applicationGuildCommand(
                                client.user!.id,
                                commandToDelete[0]?.guildId as string,
                                commandToDelete[0]!.id
                            )
                        );
                    }
                });
            index++;
            console.log(`[ Handler ] > Command "${command}" deleted.`);
        }

        if (index === commandsToDelete.length)
            console.log(`[ Handler ] > ${index} commands deleted.`);
    }
}
