import gptCategory from "./config/gptCategory";
import gpteCategory from "./config/gpteCategory";
import customCategory from "./config/customCategory";
import language from "./config/language";
import options from "./config/options";

import GPT from "./ais/gpt3/gpt";
// import GPT4E from "./ais/ethernet/gpt4";
import GPT3E from "./ais/ethernet/gpt3";
import help from "./ais/startChat/help";

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
import dalleGenerator from "./ais/image/dalle/commandFunc";

import askGpt from "./ais/ask/gpt";
import askGpte from "./ais/ask/gpte";

//Config Command
export { gptCategory, gpteCategory, customCategory, options, language };

//Start-chat Command
export { GPT, GPT3E, help };

//Opt Command
export { optIn, optOut };

//Help Command
export { Configuration, Credits, Main, AI };

//Whisper
export { whisperOptions, urlHandler, helpHandler, translateUrlHandler };

//Dall-e
export { dalleOptions, dalleGenerator };

//Ask
export { askGpt, askGpte };
