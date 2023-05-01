import CompletionPhind from "./phind/CompletionPhind";
import { PhindWrapper } from ".";

(async () => {
    const c = new PhindWrapper(
        "cf_clearance",
        "user_agent"
    );

    const phind = await c.completion(
        "gpt-4",
        "What is the meaning of life?",
        c.search("What is the meaning of life?", true),
        true,
        true
    )

    console.log(
        `Phind Response: ${(phind.completion as CompletionPhind).choices[0].text}`
    )

})();
