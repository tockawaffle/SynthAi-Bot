import { Schema, model } from "mongoose";
import redisPorts from "../interfaces/redisPorts";

const redisPorts = new Schema<redisPorts>({
    _id: { type: String, required: true, default: "redisPorts" },
    ports: [
        {
            port: { type: Number, required: true },
            status: { type: String, required: true, default: "free" },
            user: { type: String, required: false },
            sessionStartedAt: { type: Date, required: false },
        },
    ],
});

export default model<redisPorts>("redisPorts", redisPorts);
