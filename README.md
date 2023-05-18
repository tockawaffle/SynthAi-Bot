<p  align="center"> 
  <kbd> <img src="https://cdn.discordapp.com/avatars/1096096564264579133/a61a1b77e6f327f4af7bba42c6d80d51.webp?size=512"/> </kbd>
</p>

<div>
  <a href="https://wakatime.com/badge/github/tockawaffle/SynthAi-Bot">
    <img src="https://wakatime.com/badge/github/tockawaffle/SynthAi-Bot.svg">
  </a>
  <a href="https://top.gg/bot/1096096564264579133">
    <img src="https://top.gg/api/widget/owner/1096096564264579133.svg">
  </a>
  <a href="https://top.gg/bot/1096096564264579133">
    <img src="https://top.gg/api/widget/servers/1096096564264579133.svg">
  </a>
</div>

<h1 align="center"> Synth Bot 🤖 </h1>
Synth Bot is a versatile Discord bot powered by various AIs that can assist you with multiple tasks. You can use it to start conversations, ask for help, or even make jokes. With plans to integrate Eleven Labs and other APIs in the future, Synth Bot is designed to provide seamless user experience and reliable performance.

---

<h3 align="center"> Features 🗒️ </h3>

🤖 AI-Powered: Synth Bot is powered mainly by the state-of-the-art OpenAi API, which ensures high accuracy and reliability.

🗣️ Chatting: With the chatting API, Synth Bot can converse with you on a wide range of topics and help you pass the time.

🌎 Multilingual: Synth Bot can chat with you in any language that is supported by OpenAi, but the default is either Portuguese (pt-Br) or English, depending on your preference.

🔧 Customizable: You can customize the bot's configuration using the /config command to adapt it to your server's needs.

---

<h3 align="center"> Usage 📝</h3>

<h4>Misc Commands:</h4>

```
/help - Shows a list of categories of avaiable commands.
```

<h4>AI Commands</h4>

```
/start-chat help - Get help for this command!
/start-chat assistants <subject> <model> - Starts a chat using the specified subject and model (Only Servers).
/ask-me <subject> <GPT | GPTe> - Gives a single awnser with the selected model
/whisper transcribe <url> <prompting?> <language? (ISO-639-1)> - Transcribe an audio from a Youtube video.
/whisper translate <url> <prompting?> - Translates an audio from a Youtube video to English.
```

<h4>Config Commands:</h4>

```
/config category <GPT> <#Category> - Sets the category for the specified model (Per Server).
/config language <English | Portugues> - Sets the language for the bot (Per User).
/opt <in | out> - If "out", it'll delete you from the bot's DB and you'll be unable to use it until you opt in again.
```

You can also start a DM chat with the bot if you don't want to use it at a server.

---

<h3 align="center"> APIs 🌐 </h3>

<h4 align="start"> GPT-3.5 🧠 </h4>

GPT-3.5 is a state-of-the-art natural language processing model developed by OpenAI. It is capable of generating human-like responses to a wide range of text-based prompts, making it an ideal API for Synth Bot's chatting functionality.

<h4 align="start"> DALL-E 🎨 </h4>

DALL-E is a neural network that generates images from text descriptions. It is capable of creating images of a wide range of objects, including animals, food, and even abstract concepts. Synth Bot uses DALL-E to generate images based on user input.

<h4 align="start"> Whisper ASR 🎙️ </h4>

Whisper ASR is a speech recognition API developed by OpenAI. It is capable of transcribing audio from a wide range of sources, including YouTube videos and podcasts. Synth Bot uses Whisper ASR to transcribe audio from YouTube videos.

---

<h3 align="center"> Roadmap 🚀</h3>

-   [x] Creation of a token quota (These APIs aren't free, you know?)
-   [x] Integration with [Whisper ASR](https://openai.com/research/whisper) for voice-based interactions
-   [x] Integration with Bing Chat for more robust chatbot functionality - !DEPRECATED
-   [x] Opt-in and Opt-out from the Bot's DB. (Defaults to Opted-in at the moment the bot was added to the server)
-   [x] Integration with DALL-E for image creation
-   [x] Google's Bard integration for more robust chatbot functionality
-   [ ] Custom "personalities" for the bot.
-   [ ] System to reset all user's token quota every month.
-   [ ] Exclusive website for this bot.
-   [ ] Monetization through either: Kofi, Patreon or Github Esponsorship.
-   [ ] Moderation feature through [OpenAI moderation API](https://platform.openai.com/docs/api-reference/moderations). - This is going to make your server boring tho.
-   [ ] Integration with [Eleven Labs](https://beta.elevenlabs.io/) for personalized voice interactions.
-   [ ] Integration with Stable Diffusion.
-   [x] Cats, lots of them, I love cats.

---

<h3 align="center"> 🤖 Start using me! 🖥️ </h3>

There are two avaiable options for you to start using me:

**1:** You can either invite me to your Discord Server by using [this](https://discord.com/oauth2/authorize?client_id=1096096564264579133&scope=bot&permissions=536840858736) link.

(Need any help or support? Join this Discord Server: [Tocka's Nest](https://discord.gg/PtnZGGt8DD) )

**2:** Create your own instance of this bot:

First, you'll need to replace ".env.template" to ".env", and fill the following variables:

```
#This is your Discord Bot Token, you can get one by going to the developer's page and creating a bot.
DISCORD_TOKEN=

#This is a TopGG Token, you might not want to use it, you can remove all files that invoke this one: src/events/topgg, src/bot.ts @ line 9
TOPGG_TOKEN=

#You'll need a MongoDb instance, you can either use a local or hosted instance.
MONGO_URI=

#For development, use .ts, for production, use .js
FILE_EXTENSION=

#You OpenAI API Key
GPT_KEY=

#The proxy API that you'll use to get access to GPT with internet.
GPTE_API= <optional>

#The bard cookie
BARD_COOKIE=

#The bard proxy port, host, username and password (read below)
BARD_PROXY_PORT=
BARD_PROXY_HOST=
BARD_PROXY_USERNAME=
BARD_PROXY_PASSWORD=

```

! MOST of those variables are optional, you MIGHT need every single one of them.
! "GPTE_API" is optional, if none is given, it'll use the built-in module using DuckDuckGo (Might output some weird stuff tho)
! You can get a proxy by using [this](https://www.vultr.com/?ref=9457693) link ( referer link ) to create an account on Vultr, and then create a proxy instance. Tutorial [here](https://www.vultr.com/docs/install-squid-proxy-on-ubuntu/). If you don't want to use a proxy, you should remove the proxy settings from the code. (src/configs/ais/chatBased/bard/sing.ts @ line 9-19)
If you wish to create a proxy, but don't want to do the heavy lifting, I might be able set it up for you for a small fee of 5 USD.

If you're using your own proxy (Mainly the squid proxy) and find yourself getting an error thrown while trying to use bard, please refer to [this](https://github.com/PawanOsman/GoogleBard/issues/10) issue.

Install NodeJs >= v18.0.0 and run the following commands:

```bash
npm install
npm run build
npm run start
```

And you're done! You can now use your own instance of Synth Bot!

<h4>Obs:</h4> 
This bot only works with NodeJs >= v18.0.0

---

<h3 align="center"> Contributing 💻🖥️ </h3>
If you're interested in contributing to Synth Bot's development, please use this this repository to create issues, PRs (With detailed changes) and everything you consider important to change/add

---

<h3 align="center"> <a id="faq">FAQ 🔍</a> </h3>

Q: How does the AI generate the content?

A: This bot leverages an advanced AI model to create its content. The AI model, which is powered by OpenAI's GPT technology, has been trained on a wide range of data sources. These include books, websites, and other forms of written text. As a result, it has learned to understand and generate human-like text.

When the AI generates content, it doesn't simply copy and paste from its training data. Instead, it uses what it has learned to generate new, original content. This means it's creating sentences, paragraphs, and entire documents based on the patterns and structures it has observed in the training data, not copying specific passages.

To ensure the content aligns with specific needs, I guide the AI with prompts and parameters. This can range from specifying the format of the content (like a README file), to providing a particular style or tone. It's a collaborative process that combines AI capabilities with human guidance to produce the final output.

Q: What exactly was generated by AI on this bot?

A: In the development of this bot, AI played an integral role. It produced most of the content, from the README that you're reading right now to the image you see associated with the bot. While I did handle some formatting tasks, AI was extensively used in crafting the bot's code and many other components. In essence, you could say AI was a co-creator of this bot.

Q: Is this bot free to use?

A: Absolutely! Most of the time, the bot is free to use, as you can receive additional tokens for each [vote](https://top.gg/bot/1096096564264579133) on the bot. That said, if you wish to extend your support, you can monetarily contribute to the project. This will not only provide you with more tokens but also offer you the privilege to beta test new features. If you're interested, you can support me through this [link](https://linktr.ee/nixyan_).

Q: How can I acquire more tokens?

A: There are two primary ways you can earn more tokens. The first is by voting for the bot [here](https://top.gg/bot/1096096564264579133), and the second is by providing monetary support [here](https://linktr.ee/nixyan_).

Q: How can I access the beta features?

A: To gain exclusive access to the bot's beta features, all you have to do is support the project monetarily. You can do this through this [link](https://linktr.ee/nixyan_).

Q: How can I access the source code?

A: If you're interested in looking under the hood, you can access the bot's source code by clicking [here](https://github.com/tockawaffle/SynthAi-Bot).

Q: Can I clone this repository and use it as my own?

A: Yes, you are free to clone this repository and use it as a starting point for your own projects. Please remember to change the bot's name, image, and description to make it unique to your project. You'll also need to host it yourself. According to the license agreement, you must credit me for the original creation.

Q: Can I use the images that this bot generates?

A: Yes, the images generated by this bot are open for you to use as you wish, as per OpenAI's license. Please note that I cannot be held accountable for how you choose to use them.

Q: Can I use the code that this bot generates?

A: Absolutely! The code produced by this bot falls under OpenAI's license, meaning you're free to use it as you see fit. However, I must stress that I hold no responsibility for any actions you take with it.

Q: Will this bot ever require payment?

A: The future of the bot's financial model is somewhat uncertain. Currently, I'm bearing all the costs for its operation out of my own pocket. If expenses rise too high, it may become necessary to require payment for the bot or discontinue its services. However, I'm committed to doing my best to prevent that from happening. If you wish to help me maintain the bot as a free service, you can support the project financially [here](https://linktr.ee/nixyan_). This will not only help me cover the costs of running the bot but also allow me to continue developing new features.
As of 18/05/2023 (DD/MM/YYYY) the current monthly costs are:
Models: USD 15.00 ~ (BRL 75.00 ~)
Hosting: USD 5.00 ~ (BRL 25.00 ~)
Proxies: USD 5.00 ~ (BRL 25.00 ~)
Total: USD 25.00 ~ (BRL 125.00 ~)
Even though the costs are low, where I live (Brazil) the minimum wage is BRL 1.320 ~ (USD 265 ~), so USD 25 is quite a lot for me. If you wish to help me maintain the bot as a free service, you can support the project financially [here](https://linktr.ee/nixyan_). This will not only help me cover the costs of running the bot but also allow me to continue developing new features.

Q: Can I use this bot for commercial purposes?

A: Yes, you are free to use the bot for commercial purposes. However, it's imperative that you read the license agreement in its entirety before proceeding.

Q: Is the bot available in other languages?

A: Yes and no. You can talk to the AI model in whichever language you want to, it'll answer you back in that language (Unless it doesn't have the knowledge on it). However, the bot's interface is only available in English.

Q: Can the bot be integrated into my own application or service?

A: This bot doesn't have an API. However, you can use the bot's source code to create your own version of it. Please note that you must credit me for the original creation as per the license agreement.

Q: What kind of data does the bot collect and how is it used?

A: For users: Only the user id, the rest of the information on the database is created by the bot itself. For guilds: Guild ids, channel ids, channel names and guild names. This information is used to provide the bot's services and is not shared with any third parties.

Q: Is there a limit to how much I can use this bot?

A: Yes.
For Chatbased models you have 15 tokens per month, which can be increased +5 tokens per vote on the bot.
For image generation, it depends on the image size: 1024 = 5 tokens, 512 = 10 tokens, 256 = 15 tokens. These can be increased per vote on the bot.

Q: How often is the bot updated or maintained?

A: While I do my best to keep the bot updated, with new features and bug fixes, I can't guarantee that it will always be up to date since I'm the only developer working on it and my time is limited. However, I do my best to keep it running smoothly and fix any issues that arise as quickly as possible.

---

<h3 align="center"> License 📜</h3>

Synth Bot is licensed under the AGPL-3.0 license and is developed by Tockawaffle.

Synth Bot's image was made through Stable Diffusion API. Feel free to use it as you please, but as the license says, **I AM NOT** responsible for your actions with it.
