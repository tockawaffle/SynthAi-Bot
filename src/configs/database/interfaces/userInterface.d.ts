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
            avaiableTokens: number;
            tokensUsed: number;
        };
        whisperLabs: {
            avaiableTokens: number;
            tokensUsed: number;
        };
    };
}