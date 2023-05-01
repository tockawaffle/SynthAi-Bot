export default interface userSchema extends Document {
    _id: string;
    createdAt: Date;
    accountSettings: {
        language: string;
    };
    artificialInteligence: {
        chatGPT: {
            avaiableUsage: number;
            customPersonality?: {
                id: string;
                personality: string;
                type: "DM" | "Guild";
            };
        };
        whisper: {
            avaiableUsage: number;
        };
        dalle: {
            avaiable1024: number;
            avaiable512: number;
            avaiable256: number;
        };
    };
    premium:
        | "free"
        | "premium"
        | "supporter"
        | "patron";
    premiumUntil?: Date;
    channels?: {
        gptChat: {
            chat: [
                {
                    serverId: string;
                    channelId: string;
                    threadId: string;
                    model: string;
                }
            ];
        };
        gpteChat: {
            chat: [
                {
                    serverId: string;
                    channelId: string;
                    threadId: string;
                    model: string;
                }
            ];
        };
        bingChat: {
            chat: [
                {
                    serverId: string;
                    channelId: string;
                    threadId: string;
                    model: string;
                    followUp: any;
                }
            ];
        };
    };
}
