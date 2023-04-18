export default interface userSchema extends Document {
    _id: string;
    createdAt: Date;
    accountSettings: {
        language: string;
        customBackgroundName?: string;
        customMarriageBackgroundName?: string;
    };
    artificialInteligence: {
        chatGPT: {
            avaiableUsage: number;
            tokensUsed: number;
        };
        whisperLabs: {
            avaiableUsage: number;
            tokensUsed: number;
        };
    };
    premium: {
        free: boolean;
        freemium: boolean;
        premium: boolean;
        premiumPlus: boolean;
        supporter: boolean;
        supporterPlus: boolean;
        unlimited: boolean;
    };
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
        bingChat: {
            chat: [
                {
                    serverId: string;
                    channelId: string;
                    threadId: string;
                    model: string;
                }
            ];
        };
    };
}
