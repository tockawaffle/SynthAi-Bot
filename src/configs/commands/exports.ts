import gptCategory from "./config/gptCategory";
import bingCategory from "./config/bingCategory";
import language from "./config/language";
import options from "./config/options";

import GPT from "./ais/gpt3/commandFunc";
import Bing from "./ais/bing/commandFunc";

import optIn from "./config/opt-in";
import optOut from "./config/opt-out";

import Configuration from "./help/Configuration";
import Credits from "./help/Credits";
import Main from "./help/Main";
import AI from "./help/AI";

import urlHandler from "./ais/whisper/transcribeUrlHandler";
import translateUrlHandler from "./ais/whisper/translateUrlHandler";
import helpHandler from "./ais/whisper/helpHandler";
import whisperOptions from "./ais/whisper/options";

import dalleOptions from "./ais/image/options";
import dalleGenerator from "./ais/image/dalle/commandFunc"

import askGpt from "./ais/ask/gpt3";
import askBing from "./ais/ask/bing";

//Config Command
export { gptCategory, bingCategory, options, language };

//Start-chat Command
export { GPT, Bing };

//Opt Command
export { optIn, optOut };

//Help Command
export { Configuration, Credits, Main, AI };

//Whisper
export { whisperOptions, urlHandler, helpHandler, translateUrlHandler };

//Dall-e
export { dalleOptions, dalleGenerator };

//Ask
export { askGpt, askBing };