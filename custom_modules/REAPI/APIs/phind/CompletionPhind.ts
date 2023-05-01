class Choices {
    text: string;
    content: Buffer;
    index: number;
    logprobs: any;
    finish_reason: string;

    constructor(choice: any) {
        this.text = choice["text"];
        this.content = Buffer.from(this.text);
        this.index = choice["index"];
        this.logprobs = choice["logprobs"];
        this.finish_reason = choice["finish_reason"];
    }
}

export default class CompletionPhind {
    choices: Choices[];

    constructor(choices: any[]) {
        this.choices = choices.map((choice) => new Choices(choice));
    }
}
