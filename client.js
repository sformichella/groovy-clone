import { Client, Intents } from 'discord.js'

const token = process.env.discordBotToken

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

console.log('Logging in client.');

client.login(token)

console.log('Done!');

export default client