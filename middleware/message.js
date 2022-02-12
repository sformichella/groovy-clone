import { play, next, stop, config } from '../commands/index.js'

const defaultCommand = () => {
  return ''
}

export default function init(client, state) {
  return function (message) {
    const {
      content,
      guildId,
      author: { id: memberId }
    } = message

    const { commandSymbol } = state[guildId]

    const parsed = parse(content, commandSymbol)
    if(parsed === null) return

    const [command, ...args] = parsed

    if(command === 'play') {
      return play(client, {
        state,
        guildId,
        memberId,
        args
      })
    }

    if(command === 'next') {
      return next(client, {
        state,
        guildId
      })
    }

    if(command === 'stop') {
      return stop(client, {
        state,
        guildId
      })
    }

    if(command === 'config') {
      return config(client, {
        state,
        guildId,
        args
      })
    }

    return defaultCommand(client, state)
  }
}

function parse(content, commandSymbol) {
  const characters = commandSymbol.length
  const isCommand = content.slice(0, characters) === commandSymbol

  if(!isCommand) return null
  
  return content.slice(characters).split(' ')
} 
