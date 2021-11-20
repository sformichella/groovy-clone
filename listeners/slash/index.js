const client = require('../../client')

const {  identity } = require('../utils');
const { gamingGoonery } =  require('../../config.json')
const library = require('./library/index.json')

const { play, stop } = require('../music/commands')

module.exports = slashCommands

async function slashCommands(interaction) {
  if(!interaction.isCommand()) return identity
console.log('INTERACTION', interaction);
  const { commandName } = interaction

  if(commandName === 'play') {
    const channel = client
      .guilds.cache.get(gamingGoonery)
      .members.cache.get(interaction.user.id)
      .voice.channel

    const link = parseArgs(interaction)
console.log('LINK', link);
    if(!link) return identity

    return async state => {
      const result = play({ ...state, channel, link })
      console.log('PLAYER STATE', result.player.state);
      const reply = `Playing `
      await interaction.reply(reply)
      return result
    }
  }

  if(commandName === 'stop') return stop

  return identity
}

function parseArgs(interaction) {
  const { name: option, value: name } = interaction.options.data[0]

  if(option === 'clip') return library.find(c => c.name === name)

  if(option === 'link') return name

  return
}
