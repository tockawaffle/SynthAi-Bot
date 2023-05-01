import { User } from "discord.js";

export default async (user: User) => {
    const tier = user.premium;

    let memoryAmount: number;

    switch (tier) {
        case "free": {
            memoryAmount = 5;
            break;
        }
        case "premium": {
            memoryAmount = 10;
            break;
        }
        case "supporter": {
            memoryAmount = 25;
            break;
        }
        case "patron": {
            memoryAmount = 40;
            break;
        }
        case "unlimited": {
            memoryAmount = 75;
            break;
        }
        default: {
            memoryAmount = 5;
            break;
        }
    }

    return memoryAmount;
};
