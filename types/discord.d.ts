import { ChatGPTAPI } from "chatgpt";
import { OpenAIApi } from "openai";
import charAi from "node_characterai";
import { BingChat } from "bing-chat";
import { REST } from "discord.js";
import WOK from "@tockawa/wokcommands";
import translate from "../src/configs/languages/lang";
import "discord.js";

declare module "discord.js" {
    export interface Client {
        WOK: WOK;
        rest: REST;
        bing: BingChat;
        openai: OpenAIApi;
        gpte: (
            model: "gpt-4" | "gpt-3.5-turbo" | "gpt-3.5" = "gpt-4",
            cf_clearance: string,
            user_agent: string,
            prompt: string,
            creative?: boolean,
            detailed?: boolean
        ) => Promise<{
            response: string;
            details: {
                contexts: number;
                tokens: number;
                model: string;
                timeUntilCompletion: string;
            };
        }>;
        charai: charAi;
        gptSystem: (
            user: User,
            client: Client,
            type: "dm" | "guild" | "ask" | "ERALPHA"
        ) => string;
        loadUser: (client: Client) => Promise<void>;
        setLanguage: (user: User, languages: string) => void;
        translate: (user: User, commandName: string, textId: string) => string;
    }
    export interface User {
        lang: string;
        premium: "free" | "premium" | "supporter" | "patron" | "unlimited";
    }
}
