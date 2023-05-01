import { Schema, model, Document } from "mongoose";
import userSchema from "../interfaces/userInterface";

const userSchema = new Schema<userSchema>({
    _id: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    accountSettings: {
        language: { type: String, required: true, default: "english" },
    },
    artificialInteligence: {
        chatGPT: {
            avaiableUsage: { type: Number, required: true, default: 15 },
            customPersonality: { type: Object, required: false },
        },
        whisper: {
            avaiableUsage: { type: Number, required: true, default: 15 },
        },
        dalle: {
            avaiable1024: { type: Number, required: true, default: 5 },
            avaiable512: { type: Number, required: true, default: 10 },
            avaiable256: { type: Number, required: true, default: 15 },
        },
    },
    premium: { type: String, required: true, default: "free" },
    premiumUntil: { type: Date, required: false },
    channels: {
        gptChat: {
            chat: { type: Array, required: true },
        },
        gpteChat: {
            chat: { type: Array, required: true },
        },
        bingChat: {
            chat: { type: Array, required: true },
        },
    },
});

export default model<userSchema>("users", userSchema);
