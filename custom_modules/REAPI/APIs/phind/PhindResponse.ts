import Completion from "./Completion";
import CompletionPhind from "./CompletionPhind";

class Usage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;

    constructor(usage_dict: any) {
        this.prompt_tokens = usage_dict["prompt_tokens"];
        this.completion_tokens = usage_dict["completion_tokens"];
        this.total_tokens = usage_dict["total_tokens"];
    }
}

export default class PhindResponse {
    response_dict: any;
    id: string;
    object: string;
    created: number;
    model: string;
    completion: Completion;
    usage: Usage;

    constructor(response_dict: any) {
        this.response_dict = response_dict;
        this.id = response_dict["id"];
        this.object = response_dict["object"];
        this.created = response_dict["created"];
        this.model = response_dict["model"];
        this.completion = new CompletionPhind(response_dict["choices"]);
        this.usage = new Usage(response_dict["usage"]);
    }

    json(): any {
        return this.response_dict;
    }
}