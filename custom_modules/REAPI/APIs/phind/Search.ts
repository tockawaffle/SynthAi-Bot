import puppeteer from "puppeteer"

export default class Search {
    static async create(
        prompt: string,
        cf_clearance: string,
        user_agent: string,
        actualSearch: boolean = true,
        language: string = "en"
    ): Promise<any> {
        if (user_agent === "") {
            throw new Error("user_agent must be set, refer to documentation");
        }
        if (cf_clearance === "") {
            throw new Error("cf_clearance must be set, refer to documentation");
        }

        if (!actualSearch) {
            return {
                _type: "SearchResponse",
                queryContext: {
                    originalQuery: prompt,
                },
                webPages: {
                    webSearchUrl: `https://www.bing.com/search?q=${encodeURIComponent(
                        prompt
                    )}`,
                    totalEstimatedMatches: 0,
                    value: [],
                },
                rankingResponse: {
                    mainline: {
                        items: [],
                    },
                },
            };
        }

        const headers = {
            authority: "www.phind.com",
            accept: "*/*",
            "accept-language":
                "en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3",
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

        page.on(
            "request",
            (request: {
                url: () => string;
                continue: (
                    arg0:
                        | { method: string; postData: string; headers: any }
                        | undefined
                ) => void;
                headers: () => any;
            }) => {
                if (request.url() === "https://www.phind.com/api/bing/search") {
                    request.continue({
                        method: "POST",
                        postData: JSON.stringify({
                            q: prompt,
                            userRankList: {},
                            browserLanguage: language,
                        }),
                        headers: request.headers(),
                    });
                } else {
                    //@ts-ignore
                    request.continue();
                }
            }
        );

        await page.goto("https://www.phind.com/api/bing/search", {
            timeout: 60000,
        });
        const response = await page.evaluate(() =>
            JSON.parse(document.querySelector("body")!.innerText)
        );
        await browser.close();

        return response["rawBingResults"];
    }
}