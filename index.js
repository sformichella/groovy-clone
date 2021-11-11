const { Client, Intents } = require('discord.js')
const { token } = require('./auth.json')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
  ]
})

client.login(token)
// client.destroy(token)

// When the client is ready, run this code (only once)
const codingNerdStuff = 'coding-nerd-stuff'

client.once('ready', () => {
	console.log('Ready!');
  client.channels.cache
    .find(channel => channel.name === codingNerdStuff)
    .send('Wasssssup')
});
