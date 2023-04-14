export default interface serverSchema extends Document {
    _id: string;
    channels: {
        gptCategory: string;
        whisperLabsCategory: string;
        // welcomeChannel?: string;
        // rulesChannel?: string;
    };
    createdAt: Date;
    premium: {
        free: boolean;
        freemium: boolean;
        premium: boolean;
        premiumPlus: boolean;
        supporter: boolean;
        supporterPlus: boolean;
        unlimited: boolean;
    };
}