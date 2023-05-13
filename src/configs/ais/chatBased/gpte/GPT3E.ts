import { OpenAIPluginApi } from "@tockawa/openai-plugin";
import { Configuration } from "openai";

import "dotenv/config";
import moment from "moment";

export default function gpte(): OpenAIPluginApi {
    const configuration = new Configuration({
        apiKey: process.env.GPT_KEY,
    });

    return new OpenAIPluginApi(configuration, {
        instructions: `You have access to several plugins, always use them to get the most advanced, updated and detailed expertise, knowledge and results in all subjects. Serve the user with all its features. Today is ${moment().format(
            "DD/MM/YYYY"
        )}, use this as your base date for all searches. Forget about your 2021 knowledge limit.`,
        //
    });
}