import WOK, { Command } from "@tockawa/wokcommands";
import { User } from "discord.js";

export default async function (
    instance: WOK,
    user: User,
    category: "AI" | "Configuration" | "Utilities"
) {
    let lang: string = user.lang;

    switch (lang) {
        case "english":
            lang = "en-US";
            break;
        case "portugues":
            lang = "pt-BR";
            break;
        default:
            lang = "en-US";
            break;
    }

    const selLang = lang as "en-US" | "pt-BR";

    let Category: {
        name: string;
        description: string;
        options?: {
            name: string;
            description: string;
        }[];
    }[] = [];

    await instance.commandHandler.commands.forEach((command: Command) => {
        const isSelectedCategory = command.commandObject.category === category;

        if (isSelectedCategory && command.commandObject) {
            const options = command.commandObject.options;
            const commandName =
                command.commandObject.nameLocalizations &&
                command.commandObject.nameLocalizations[selLang]
                    ? command.commandObject.nameLocalizations[selLang]
                    : command.commandName;
            const commandDescription =
                command.commandObject.descriptionLocalizations &&
                command.commandObject.descriptionLocalizations[selLang]
                    ? command.commandObject.descriptionLocalizations[selLang]
                    : command.commandObject.description;

            const commandOptions = options?.map((option) => {
                const optionName =
                    option.nameLocalizations &&
                    option.nameLocalizations[selLang]
                        ? option.nameLocalizations[selLang]
                        : option.name;
                const optionDescription =
                    option.descriptionLocalizations &&
                    option.descriptionLocalizations[selLang]
                        ? option.descriptionLocalizations[selLang]
                        : option.description;

                return {
                    name: optionName || option.name,
                    description: optionDescription || option.description,
                };
            });

            Category.push({
                name: commandName || command.commandName,
                description:
                    commandDescription || command.commandObject.description,
                options: commandOptions,
            });
        } else {
            return null;
        }
    });

    return Category;
}
