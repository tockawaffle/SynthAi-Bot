import { ChatGPTAPI } from "chatgpt";
import "discord.js";
import { REST } from "discord.js";
import Translator from "../src/configs/languages/lang";
import { BingChat } from "bing-chat";
import { OpenAIApi } from "openai";
import WOK from "@tockawa/wokcommands";

declare module "discord.js" {
    export interface Client {
        rest: REST;
        gpt: OpenAIApi;
        gptPersist: ChatGPTAPI;
        bing: BingChat;
        setLanguage: Translator["setUserLanguage"];
        translate: Translator["translateText"];
        loadUser: function;
        WOK: WOK;
    }
    export interface User {
        lang: string;
        gptTokensAvailable: number;
        whisperLabsTokensAvailable: number;
        premium: {
            free: boolean;
            freemium: boolean;
            premium: boolean;
            premiumPlus: boolean;
            supporter: boolean;
            supporterPlus: boolean;
            unlimited: boolean;
        };    
    }
}
