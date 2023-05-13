import { Schema, model, Document } from "mongoose";
import serverSchema from "../interfaces/serverInterface";

const serverSchema = new Schema<serverSchema>({
    _id: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    channels: {
        gptCategory: { type: String, required: true },
        gpteCategory: { type: String, required: true },
        customCategory: { type: String, required: true },
        // commandsChannel: { type: String, required: true },
        // welcomeChannel: { type: String, required: false },
        // rulesChannel: { type: String, required: false },
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
});

export default model<serverSchema>("servers", serverSchema);
