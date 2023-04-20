import { Schema, model, Document } from "mongoose";
import optedOut from "../interfaces/optedOut";

const optedOut = new Schema<optedOut>({
    _id: { type: String, required: true, default: "optedOut" },
    ids: { type: [], required: true, default: [] },
    
});

export default model<optedOut>("optedOut", optedOut);
