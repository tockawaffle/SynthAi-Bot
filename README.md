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
/start-chat <subject> <model> - Starts a chat using the specified subject and model (Only Servers).
/ask-me <subject> <free | tokenized> - Gives a single awnser with the selected model (Bing or GPT)
/whisper transcribe <url> <prompting?> <language? (ISO-639-1)> - Transcribe an audio from a Youtube video.
/whisper translate <url> <prompting?> - Translates an audio from a Youtube video to English.
```

<h4>Config Commands:</h4>

```
/config category <Bing | GPT> <#Category> - Sets the category for the specified model (Per Server).
/config language <English | Portugues> - Sets the language for the bot (Per User).
/opt <in | out> - If "out", it'll delete you from the bot's DB and you'll be unable to use it until you opt in again.
```

You can also start a DM chat with the bot if you don't want to use it at a server.

---

<h3 align="center"> APIs 🌐 </h3>

<h4 align="start"> GPT-3.5 🧠 </h4>

GPT-3.5 is a state-of-the-art natural language processing model developed by OpenAI. It is capable of generating human-like responses to a wide range of text-based prompts, making it an ideal API for Synth Bot's chatting functionality.

---

<h3 align="center"> Roadmap 🚀</h3>

-   [x] Creation of a token quota (These APIs aren't free, you know?)
-   [x] Integration with [Whisper ASR](https://openai.com/research/whisper) for voice-based interactions
-   [x] Integration with Bing Chat for more robust chatbot functionality
-   [x] Opt-in and Opt-out from the Bot's DB. (Defaults to Opted-in at the moment the bot was added to the server)
-   [x] Integration with DALL-E for image creation
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

#A Cloudflare clearance token.
CF=
#A browser user agent.
UA=

```

! NONE of those variables are optional, you WILL need every single one of them.

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

<h3 align="center"> FAQ 🔍 </h3>

Q: What exactly was generated by AI on this bot?

A: Pretty much everything really, this whole README was generated by AI (Most of it, formatting was done by me), it's Image was generated by AI, it's code was made
with the help of an AI, and so on.

---

<h3 align="center"> License 📜</h3>

Synth Bot is licensed under the AGPL-3.0 license and is developed by Tockawaffle.

Synth Bot's image was made through Stable Diffusion API. Feel free to use it as you please, but as the license says, **I AM NOT** responsible for your actions with it.
