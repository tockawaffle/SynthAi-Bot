import puppeteer from "puppeteer";
import PhindResponse from "./PhindResponse";

export default class Completion {
    static async create(
        model: "gpt-4" | "gpt-3.5-turbo" | "gpt-3.5" = "gpt-4",
        prompt: string = "",
        cf_clearance: string,
        user_agent: string,
        results: any = null,
        creative: boolean = false,
        detailed: boolean = false,
        codeContext: string = "",
        language: string = "en"
    ): Promise<PhindResponse> {
        const models = {
            "gpt-4": "expert",
            "gpt-3.5-turbo": "intermediate",
            "gpt-3.5": "intermediate",
        };

        const json_data = {
            question: prompt,
            bingResults: results,
            codeContext: codeContext,
            options: {
                skill: models[model],
                date: new Date().toLocaleDateString("en-GB"),
                language: language,
                detailed: detailed,
                creative: creative,
            },
        };

        const headers = {
            authority: "www.phind.com",
            accept: "*/*",
            "accept-language":
                "en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3",
            "content-type": "application/json",
            cookie: `cf_clearance=${cf_clearance}`,
            origin: "https://www.phind.com",
            referer:
                "https://www.phind.com/search?q=hi&c=&source=searchbox&init=true",
            "sec-ch-ua":
                '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": user_agent,
        };

        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
            ]
        });
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders(headers);
        await page.setRequestInterception(true);

        page.on("request", (request) => {
            if (request.url() === "https://www.phind.com/api/infer/answer") {
                request.continue({
                    method: "POST",
                    postData: JSON.stringify(json_data),
                    headers: request.headers(),
                });
            } else {
                request.continue();
            }
        });

        await page.goto("https://www.phind.com/api/infer/answer", {
            timeout: 60000,
        });
        const response = await page.evaluate(
            () => document.querySelector("body")!.textContent!
        );

        await browser.close();

        let completion = "";
        const lines = response.split("\r\n");
        for (const line of lines) {
            const cleanedLine = line.replace(/data: /g, "");
            if (cleanedLine.trim() !== "") {
                completion += cleanedLine + " ";
            }
        }
        completion = completion.trim().replaceAll("\n", "");

        return new PhindResponse({
            id: `cmpl-1337-${Math.floor(Date.now() / 1000)}`,
            object: "text_completion",
            created: Math.floor(Date.now() / 1000),
            model: models[model],
            choices: [
                {
                    text: completion,
                    index: 0,
                    logprobs: null,
                    finish_reason: "stop",
                },
            ],
            usage: {
                prompt_tokens: prompt.length,
                completion_tokens: completion.length,
                total_tokens: prompt.length + completion.length,
            },
        });
    }
}