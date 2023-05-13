import axios from "axios";
import querystring from "querystring";
import { AnyNode, load } from "cheerio";

async function getHtml({
    search,
}: {
    search: {
        query: string;
        timeRange?: any;
        region?: any;
    };
}): Promise<any> {
    var { query, timeRange, region } = search as {
        query: string;
        timeRange: string;
        region: string;
    };
    const baseUrl = "https://html.duckduckgo.com/html/";
    const formData = {
        q: query,
        df: "m",
        kl: region,
    };
    const form = querystring.stringify(formData);
    const response = await axios.post(baseUrl, form, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "text/html",
            "User-Agent":
                "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
        },
    });

    if (response.status !== 200) {
        throw new Error(
            `Status code: ${response.status} Body: ${response.data}`
        );
    }

    return response.data;
}

function parseHtml(html: string | AnyNode | AnyNode[] | Buffer) {
    const finalResults: {
        title: string;
        link: string | undefined;
        snippet: string;
    }[] = [];
    const $ = load(html);

    const resultBodies = $("div.result__body");

    resultBodies.each((_index, item) => {
        const title = $(item).find("a.result__a").text();
        const link = $(item).find("a.result__a").attr("href");
        const snippet = $(item).find("a.result__snippet").text();

        finalResults.push({
            title: title,
            link: link,
            snippet: snippet,
        });
    });

    return finalResults;
}

async function duckduckgo({
    search,
    number = 10,
}: {
    search: { query: string; timeRange?: string; region?: string };
    number?: number;
}): Promise<string> {
    try {
        const { query, timeRange, region } = search as {
            query: string;
            timeRange: string;
            region: string;
        };
        const html = await getHtml({ search: { query, timeRange, region } });
        var results = parseHtml(html);
        var response =
            "Here are the DuckDuckGo results for your search: " +
            search.query +
            "\n";
        results = results.slice(0, number);
        for (var i = 0; i < results.length; i++) {
            response +=
                "Title: " +
                results[i].title +
                "\nLink: " +
                results[i].link +
                "\nDescription: " +
                results[i].snippet +
                "\n\n";
        }
        return response.replaceAll("\\\\", "\\");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const sdk = {
    search: async function ({
        query,
        region = "pt-br",
        timeRange = "d",
    }: {
        query: string;
        region?: string;
        timeRange?: string;
    }) {
        if (timeRange == "all") timeRange = "";
        const search = {
            query,
            timeRange,
            region: region.toLowerCase(),
        };

        const data = await duckduckgo({ search });

        if (data) {
            return { data, status: 200 };
        } else {
            return { data: "No results found", status: 404 };
        }
    },
};

const reference = `
name: DuckDuckGoSearch
description: Searches up to date info in the web using DuckDuckGo,the query and returns the top 25 results. 3 inputs accepted.
method: search
parameters:
    - name: query
      type: string
      description: The search query.
      required: true
    - name: region
      type: string
      description: The region to search in. Must be following a standard combination of country code (ISO 3166-1 alpha-2) and language code (ISO 639-1). For example, "br-pt" means Brasil (BR) in Portuguese (PT).
      required: false
    - name: timeRange
      type: string
      description: The time range to search in. Must be one of the following: 'd' to past day, 'w' to past week, 'm' to past month, 'y' to past year, 'all' for all time. Defaults to 'd'
      required: true
`;

var name = "DuckDuckGoSearch";

export default { name, reference, sdk };
