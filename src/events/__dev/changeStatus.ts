import { ActivityType, Client } from "discord.js";

export default async (client: Client) => {
    const gpt = await client.gpt.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content:
                    "Talk in first person and use proper grammar. Create an status update for your Discord profile.",
            },
            {
                role: "system",
                content: `You are on Discord, integrated via OpenAi's API. The bot's name is ${
                    client.user!.username
                }, created by ${
                    client.users.cache.get("876578406144290866")!.username
                }, a brief description about you: Synth Bot is a versatile Discord bot powered by GPT-3.5 API that can assist you with multiple tasks. You can use it to start conversations, ask for help, or even make jokes. With plans to integrate Whisper, Bing Chat, and Eleven Labs in the future, Synth Bot is designed to provide seamless user experience and reliable performance.`,
            },
        ],
    });

    return client.user!.setPresence({
        activities: [
            {
                name: gpt.data.choices[0].message!.content,
                type: ActivityType.Playing,
            },
        ],
    });
};
