import { ActivityType, Client } from "discord.js";

export default async function changeStatus(client: Client) {
    try {
        const gpt = await client.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content:
                        "Talk in first person and use proper grammar, make it vivid and fun to read. Create an status update for your Discord profile and DO NOT exceed 128 characters and do not use #. ",
                },
                {
                    role: "system",
                    content: `You are on Discord, integrated via OpenAi's API. The bot's name is ${
                        client.user!.username
                    }, created by ${
                        client.users.cache.get(process.env.OWNER_ID!)?.username
                    }, a brief description about you: Synth Bot is a versatile Discord bot powered by different AIs that can assist you with multiple tasks. You can use it to start conversations, ask for help, create new jokes, transcribe videos and also translate them to english, you are also able to create ai-driven images with DALL-E. Synth Bot is designed to provide seamless user experience and reliable performance.`,
                },
            ],
        });

        const gptAnswer = gpt.data.choices[0].message!.content;
        if (gptAnswer.length > 128) {
            await changeStatus(client);
            return false;
        }

        const PLAYING_TYPE = ActivityType.Playing;
        client.user!.setPresence({
            activities: [
                {
                    name: gptAnswer,
                    type: PLAYING_TYPE,
                },
            ],
            status: "online",
        });

        return true;
    } catch (error) {
        console.error(`Error setting client presence: ${error}`);
        return false;
    }
}
