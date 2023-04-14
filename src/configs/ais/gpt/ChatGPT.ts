import { Client } from "discord.js";
import userSchema from "../../database/models/userSchema";

export default async function (apiKey: string, client: Client) {
    const importDynamic = new Function(
        "modulePath",
        "return import(modulePath)"
    );
    const { ChatGPTAPI } = await importDynamic("chatgpt");

    const chatCompletion = new ChatGPTAPI({
        apiKey,
        completionParams: {
            temperature: 0.2,
            max_tokens: 50,
            presence_penalty: 0.5,
        },
    });

    client.gpt = chatCompletion;

    for (const [userId] of client.users.cache) {
        const result = await userSchema.findOne({ _id: userId });
        const AI = result?.artificialInteligence;
        if (!AI) {
            await userSchema.updateOne(
                { _id: userId },
                {
                    $set: {
                        artificialInteligence: {
                            chatGPT: {
                                avaiableTokens: 100,
                                tokensUsed: 0,
                            },
                            whisperLabs: {
                                avaiableTokens: 50,
                                tokensUsed: 0,
                            },
                        },
                    },
                }
            );

            const findUser = await userSchema.findOne({ _id: userId });

            const AI = findUser!.artificialInteligence;

            const getUser = client.users.cache.get(userId)!;
            getUser.lang = "english";
            getUser.gptTokensAvailable = AI.chatGPT.avaiableTokens;
            getUser.gptTokensUsed = AI.chatGPT.tokensUsed;
            getUser.whisperLabsTokensAvailable = AI.whisperLabs.avaiableTokens;
            getUser.whisperLabsTokensUsed = AI.whisperLabs.tokensUsed;
        } else {
            const getUser = client.users.cache.get(userId)!;
            getUser.lang = "english";
            getUser.gptTokensAvailable = AI.chatGPT.avaiableTokens;
            getUser.gptTokensUsed = AI.chatGPT.tokensUsed;
            getUser.whisperLabsTokensAvailable = AI.whisperLabs.avaiableTokens;
            getUser.whisperLabsTokensUsed = AI.whisperLabs.tokensUsed;
        }
    }
}
