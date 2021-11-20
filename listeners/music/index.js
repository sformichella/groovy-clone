const client = require('../../client')

const { identity } = require('../utils')
const { commandSymbol, gamingGoonery } = require('../../config.json')

const { play, stop } = require('./commands')

module.exports = musicCommands

function musicCommands(message) {
  const { content } = message
  const [bot, ...cmdLine] = content.split(' ')

  const isCommand = bot === commandSymbol || bot[0] === commandSymbol
  if(!isCommand) return identity

  const [command, link] = parseArgs(cmdLine)

  if(command === 'play') {
    const channel = client
      .guilds.cache.get(gamingGoonery)
      .members.cache.get(message.member.id)
      .voice.channel

    return async state => {
      const result = await play({ ...state, link, channel })
      return result
    }
  }

  if(command === 'stop') return stop

  return identity
}

function parseArgs(args) {
  const commands = ['play', 'stop']

  const command = commands.find(c => c === args[0]) || 'play'

  // Is this confusing??
  const remaining = (command === args[0] ?
    args.slice(1) :
    args
  ).join(' ')

  return [command, remaining]
}
