const discord = require('discord.io')
const auth = require('auth.json')

const bot = discord.Client({
  token: auth.token,
  autorun: true,
})

bot.on('ready', function() {
  console.log('hi');
})
