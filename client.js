const { Client, Intents } = require('discord.js')
const { token } = require('./config.json')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

client.login(token)

module.exports = client