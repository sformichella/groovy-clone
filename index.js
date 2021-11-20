const client = require('./client');

const useSlashCommands = require('./middleware/slashCommands');
const musicCommands = require('./middleware/music')

const initialState = {}

const updateListenerState = listener => {
  return state => {
    return message => {
      const result = listener(message)(state)
      client.removeAllListeners('messageCreate')
      client.on('messageCreate', updateListenerState(listener)(result))
      return result
    }
  }
}

const wrappedMessageCommands = updateListenerState(musicCommands)(initialState)

client.on('messageCreate', wrappedMessageCommands)
client.on('interactionCreate', useSlashCommands)
