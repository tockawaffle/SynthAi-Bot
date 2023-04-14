import { Schema, model, Document } from "mongoose";
import userSchema from "../interfaces/userInterface";

const userSchema = new Schema<userSchema>({
    _id: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    accountSettings: {
        language: { type: String, required: true, default: "english" },
        id: { type: String, required: true, },
    },
    artificialInteligence: {
        chatGPT: {
            avaiableTokens: { type: Number, required: true, default: 100 },
            tokensUsed: { type: Number, required: true, default: 0 },
        },
        whisperLabs: {
            avaiableTokens: { type: Number, required: true, default: 50 },
            tokensUsed: { type: Number, required: true, default: 0 },
        },
    },
});

export default model<userSchema>("users", userSchema);
