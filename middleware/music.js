const { createAudioPlayer } = require('@discordjs/voice')

const client = require('../client')
const { commandSymbol, gamingGoonery } = require('../config.json')
const { parseArgs, createConnection, createResourceFromLink } = require('../utils')

module.exports = musicCommands

const identity = x => x

const play = ({ message, ...state }) => {
  const channel = client
    .guilds.cache.get(gamingGoonery)
    .members.cache.get(message.member.id)
    .voice.channel

  const connection = createConnection(channel)
  const resource = createResourceFromLink(state.link)
  const player = createAudioPlayer()

  connection.subscribe(player)
  player.play(resource)

  return { ...state, connection, player }
}

const stop = ({ player, connection, ...state }) => {
  if(player) player.stop()
  if(connection) connection.destroy()
  return { ...state }
}

function musicCommands(message) {
  const { content } = message
  const [word, ...rawArgs] = content.split(' ')

  const isCommand = word === commandSymbol || word[0] === commandSymbol
  if(!isCommand) return identity

  const [command, link] = parseArgs(rawArgs).split(' ')

  if(command === 'play') {
    return state => {
      return play({ ...state, link, message })
    }
  }

  if(command === 'stop') {
    return stop
  }

  return identity
}
