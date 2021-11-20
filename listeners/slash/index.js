const client = require('../../client')

const {  identity } = require('../utils');
const { gamingGoonery } =  require('../../config.json')
const library = require('./library/index.json')

const { play, stop } = require('../music/commands')

module.exports = slashCommands

function slashCommands(interaction) {
  if(!interaction.isCommand()) return identity

  const { commandName: command } = interaction

  if(command === 'play') {
    const channel = client
      .guilds.cache.get(gamingGoonery)
      .members.cache.get(interaction.user.id)
      .voice.channel

    const { link, reply: defaultReply } = parseArgs(interaction)

    if(!link) return identity

    return async (state) => {
      const result = await play({ ...state, channel, link })
      const reply = defaultReply || `Playing: ${result.player.title}`
      await interaction.reply(reply)
      return result
    }
  }

  if(command === 'stop') return async state => {
    console.log('INTERACTION', interaction);
    const reply = 'Stopping playback'
    await interaction.reply(reply)
    return stop(state)
  }

  return identity
}

function parseArgs(interaction) {
  const { name: option, value: name } = interaction.options.data[0]

  if(option === 'clip') return library.find(c => c.name === name)

  if(option === 'link') return { link: name }

  return
}
