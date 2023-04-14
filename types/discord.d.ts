import { ChatGPTAPI } from "chatgpt";
import "discord.js";
import { REST } from "discord.js";
import Translator from "../src/configs/languages/lang";

declare module "discord.js" {
    export interface Client {
        rest: REST;
        gpt: ChatGPTAPI;
        setLanguage: Translator["setUserLanguage"];
        translate: Translator["translateText"];
        loadUser: function;
    }
    export interface User {
        lang: string;
        gptTokensAvailable: number;
        gptTokensUsed: number;
        whisperLabsTokensAvailable: number;
        whisperLabsTokensUsed: number;
    }
}
