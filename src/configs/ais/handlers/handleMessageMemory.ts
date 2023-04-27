import { User } from "discord.js";

export default async (user: User) => {
    const tier = user.premium;

    let memoryAmount: number;

    switch (tier) {
        case "premium": {
            memoryAmount = 20;
            break;
        }
        case "free": {
            memoryAmount = 5;
            break;
        }
        case "freemium": {
            memoryAmount = 10;
            break;
        }
        case "premiumPlus": {
            memoryAmount = 28;
            break;
        }
        case "supporter": {
            memoryAmount = 35;
            break;
        }
        case "supporterPlus": {
            memoryAmount = 40;
            break;
        }
        case "tester": {
            memoryAmount = 70;
            break;
        }
        case "unlimited": {
            memoryAmount = 999;
            break;
        }
        default: {
            memoryAmount = 5;
            break;
        }
    }

    return memoryAmount;
};
