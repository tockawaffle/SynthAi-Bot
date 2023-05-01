import { PhindWrapper } from "./APIs";
import { performance } from "perf_hooks";
import moment from "moment";
import CompletionPhind from "./APIs/phind/CompletionPhind";

export default async function phind(
    model: "gpt-4" | "gpt-3.5-turbo" | "gpt-3.5" = "gpt-4",
    cf_clearance: string,
    user_agent: string,
    prompt: string,
    creative?: boolean,
    detailed?: boolean
) {
    const startTime = performance.now();

    try {
        const phind = new PhindWrapper(cf_clearance, user_agent)
        const completion = await phind.completion(
            model,
            prompt,
            await phind.search(prompt, true),
            creative,
            detailed
        );

        const choices = (completion.completion as CompletionPhind).choices
    
        const endTime = performance.now();
        const elapsedTime = moment.duration(endTime - startTime, "milliseconds");
        const elapsedTimeSeconds = elapsedTime.asSeconds();
        const roundedElapsedTimeSeconds = Math.round(elapsedTimeSeconds);
    
        return {
            response: choices[0].text,
            details: {
                contexts: choices.length,
                tokens: completion.usage.total_tokens,
                model: completion.model,
                timeUntilCompletion: `~${roundedElapsedTimeSeconds} seconds`,
            },
        };
    } catch (error: any) {
        return {
            response: `Error: ${error.message}`,
            details: {
                contexts: 0,
                tokens: 0,
                model: model,
                timeUntilCompletion: "0 seconds",
            },
        };
    }
}
