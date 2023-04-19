<p  align="center"> 
  <kbd> <img src="https://cdn.discordapp.com/avatars/1096096564264579133/a61a1b77e6f327f4af7bba42c6d80d51.webp?size=512"/> </kbd>
</p>

[![wakatime](https://wakatime.com/badge/github/tockawaffle/SynthAi-Bot.svg)](https://wakatime.com/badge/github/tockawaffle/SynthAi-Bot)

<h1 align="center"> Synth Bot 🤖 </h1>
Synth Bot is a versatile Discord bot powered by GPT-3.5 API that can assist you with multiple tasks. You can use it to start conversations, ask for help, or even make jokes. With plans to integrate Whisper, Bing Chat, and Eleven Labs in the future, Synth Bot is designed to provide seamless user experience and reliable performance.

---

<h3 align="center"> Features 🗒️ </h3>

🤖 AI-Powered: Synth Bot is powered by the state-of-the-art GPT-3.5 API, which ensures high accuracy and reliability.

🗣️ Chatting: With the chatting API, Synth Bot can converse with you on a wide range of topics and help you pass the time.

🌎 Multilingual: Synth Bot can chat with you in any language that is supported by OpenAi, but the default is either Portuguese (pt-Br) or English, depending on your preference.

🔧 Customizable: You can customize the bot's configuration using the /config command to adapt it to your server's needs.

***

<h3 align="center"> Usage 📝</h3>
Commands are executed through Discord interactions:

```
Allows users to configure both the bot's channel categories and their preferred language (English or Portuguese):
/config [categories] <?whisper> | <?gpt> | [languages]

Initiates a chat using the selected chat model:
/start-chat [topic] [model]
```

You can also start a DM chat with the bot if you don't want to use it at a server.

---

<h3 align="center"> APIs 🌐 </h3>

<h4 align="start"> GPT-3.5 🧠 </h4>

GPT-3.5 is a state-of-the-art natural language processing model developed by OpenAI. It is capable of generating human-like responses to a wide range of text-based prompts, making it an ideal API for Synth Bot's chatting functionality.

---

<h3 align="center"> Roadmap 🚀</h3>

- [ ] Creation of a token quota (These APIs aren't free, you know?)
- [ ] Integration with [Whisper ASR](https://openai.com/research/whisper) for voice-based interactions
- [ ] Integration with Bing Chat for more robust chatbot functionality
- [ ] Integration with [Eleven Labs](https://beta.elevenlabs.io/) for personalized voice interfaces
- [ ] Opt-in and Opt-out from the Bot's DB. (Defaults to Opted-in at the moment the bot was added to the server)
- [ ] Integration with Stable Diffusion.
- [ ] Integration with DALL-E for image creation
- [ ] Monetization through either: Kofi, Patreon or Github Esponsorship.
- [ ] Moderation feature through [OpenAI moderation API](https://platform.openai.com/docs/api-reference/moderations) - This is going to make your server boring tho.
- [X] Cats, lots of them, I love cats.

---

<h3 align="center"> 🤖 Start using me! 🖥️ </h3>

There are two avaiable options for you to start using me:

**1:** You can either invite me to your Discord Server by using [this](https://discord.com/oauth2/authorize?client_id=1096096564264579133&scope=bot&permissions=536840858736) link.

(Need any help or support? Join this Discord Server: [Tocka's Nest](https://discord.gg/d7B7fnp2BW) )

**2:** Create your own instance of this bot:

First, you'll need to replace ".env.template" to ".env", and fill the following variables:

```
This is your Discord Bot Token, you can get one by going to the developer's page and creating a bot.
DISCORD_TOKEN=

You'll need a MongoDb instance, you can either use a local or hosted instance.
MONGO_URI=

For development, use .ts, for production, use .js
FILE_EXTENSION=

You OpenAI API Key
GPT_KEY=
```

NONE of those variables are optional, you WILL need every single one of them.

This bot only works with NodeJs >= v18.0.0

---

<h3 align="center"> Contributing 💻🖥️ </h3>
If you're interested in contributing to Synth Bot's development, please use this this repository to create issues, PRs (With detailed changes) and everything you consider important to change/add

---

<h3 align="center"> License 📜</h3>

Synth Bot is licensed under the AGPL-3.0 license and is developed by Tockawaffle.

Synth Bot's image was made through Stable Diffusion API. Feel free to use it as you please, but as the license says, **I AM NOT** responsible for your actions with it.
