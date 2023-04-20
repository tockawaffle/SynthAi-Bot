import { Schema, model, Document } from "mongoose";
import userSchema from "../interfaces/userInterface";

const userSchema = new Schema<userSchema>({
    _id: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    accountSettings: {
        language: { type: String, required: true, default: "english" },
        id: { type: String, required: true },
    },
    artificialInteligence: {
        chatGPT: {
            avaiableUsage: { type: Number, required: true, default: 15 },
        },
        whisperLabs: {
            avaiableUsage: { type: Number, required: true, default: 5 },
        },
    },
    premium: {
        free: { type: Boolean, required: true, default: true },
        freemium: { type: Boolean, required: true, default: false },
        premium: { type: Boolean, required: true, default: false },
        premiumPlus: { type: Boolean, required: true, default: false },
        supporter: { type: Boolean, required: true, default: false },
        supporterPlus: { type: Boolean, required: true, default: false },
        unlimited: { type: Boolean, required: true, default: false },
    },
    channels: {
        gptChat: {
            chat: { type: Array, required: true },
        },
        bingChat: {
            chat: { type: Array, required: true },
        }
    },
});

export default model<userSchema>("users", userSchema);
