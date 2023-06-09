import { REST } from "discord.js";
import { OpenAIApi } from "openai";
import { OpenAIPluginApi } from "@tockawa/openai-plugin";
import { Bard } from "googlebard";
import WOK from "@tockawa/wokcommands";
import translate from "../src/configs/languages/lang";
import "discord.js";

declare module "discord.js" {
    export interface Client {
        WOK: WOK;
        rest: REST;
        openai: OpenAIApi;
        openaiPlugin: OpenAiPluginApi
        gpte: OpenAIPluginApi;
        bard: Bard
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
