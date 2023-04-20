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

export {
    gptCategory,
    bingCategory,
    options,
    language,
}

export {
    GPT,
    Bing
}

export {
    optIn,
    optOut
}

export {
    Configuration,
    Credits,
    Main,
    AI,
}