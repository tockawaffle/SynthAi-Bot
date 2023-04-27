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
        charai: charAi;
        gptSystem: (user: User, client: Client, type: "dm" | "guild" | "ask") => string;
        loadUser: (client: Client) => Promise<void>;
        setLanguage: (user: User, languages: string) => void;
        translate: (user: User, commandName: string, textId: string) => string;
    }
    export interface User {
        lang: string;
        premium:
            | "free"
            | "freemium"
            | "premium"
            | "premiumPlus"
            | "supporter"
            | "supporterPlus"
            | "tester"
            | "unlimited";
    }
}
