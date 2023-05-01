import PhindResponse from "./phind/PhindResponse";
import Completion from "./phind/Completion";
import Search from "./phind/Search";

export class PhindWrapper {
    cf_clearance: string;
    user_agent: string;

    constructor(cf_clearance: string, user_agent: string) {
        this.cf_clearance = cf_clearance;
        this.user_agent = user_agent;
    }

    async search(
        prompt: string,
        actualSearch: boolean = true,
        language: string = "en"
    ): Promise<any> {
        return await Search.create(
            prompt,
            this.cf_clearance,
            this.user_agent,
            actualSearch,
            language
        );
    }

    async completion(
        model: "gpt-4" | "gpt-3.5-turbo" | "gpt-3.5" = "gpt-4",
        prompt: string = "",
        results: any = null,
        creative: boolean = false,
        detailed: boolean = false,
        codeContext: string = "",
        language: string = "en"
    ): Promise<PhindResponse> {
        return await Completion.create(
            model,
            prompt,
            this.cf_clearance,
            this.user_agent,
            results,
            creative,
            detailed,
            codeContext,
            language
        );
    }
}
