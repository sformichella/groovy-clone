const { createAudioPlayer } = require('@discordjs/voice')

const client = require('../client')
const { commandSymbol, gamingGoonery } = require('../config.json')
const { parseArgs, createConnection, createResourceFromLink } = require('../utils')

module.exports = useMessageCommands

function useMessageCommands(message) {
  const { content } = message
  const [word, ...rawArgs] = content.split(' ')

  const isCommand = word === commandSymbol || word[0] === commandSymbol
  if(!isCommand) return

  const [command, link] = parseArgs(rawArgs).split(' ')

  const player = createAudioPlayer()

  if(command === 'play') {
    const channel = client
      .guilds.cache.get(gamingGoonery)
      .members.cache.get(message.member.id)
      .voice.channel

    const connection = createConnection(channel)

    connection.on('stateChange', (_, current) => {
      if(current.status === 'idle') {
        connection.destroy()
      }
    })

    const resource = createResourceFromLink(link)

    connection.subscribe(player)
    player.play(resource)

    player.on('stateChange', (_, current) => {
      if(current.status === 'idle') {
        connection.destroy()
      }
    })
  }

  if(command === 'stop') {

  }
}