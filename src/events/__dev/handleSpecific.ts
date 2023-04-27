import { Message, User } from "discord.js";
import userSchema from "../../configs/database/models/userSchema";
import moment from "moment";

const BOT_OWNER_ID = process.env.OWNER_ID!;
const AVAILABLE_COMMANDS = ["premiumAdd"];

export default async (user: User, msg: Message) => {
    if (user.id !== BOT_OWNER_ID) return false;

    const [commandName, userId, choiceName, daysStr] = msg.content.split(" ");
    if (!AVAILABLE_COMMANDS.includes(commandName)) return false;

    const choices = [
        "free",
        "freemium",
        "premium",
        "premiumPlus",
        "supporter",
        "supporterPlus",
        "tester",
        "unlimited",
    ];
    if (!choices.includes(choiceName)) return false;

    const userToPremium = msg.client.users.cache.get(userId);
    if (!userToPremium) return false;

    const days = parseInt(daysStr, 10);

    await userSchema.updateOne(
        { _id: userToPremium.id },
        {
            $set: {
                premium: choiceName,
                premiumUntil: moment().add(days, "days").toDate(),
            },
        },
        { upsert: true }
    );

    return true;
};