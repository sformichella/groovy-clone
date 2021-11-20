const client = require('./client');

const slash = require('./listeners/slash');
const music = require('./listeners/music')

const initialState = {}

const musicUpdater = listener => {
  return state => {
    return async message => {
      const result = await listener(message)(state)
      client.removeListener('messageCreate', listener)
      client.on('messageCreate', musicUpdater(listener)(result))
      return result
    }
  }
}

const slashUpdater = listener => {
  return state => {
    return async interaction => {
      const result = await listener(interaction)(state)
      client.removeListener('interationCreate', listener)
      client.on('interationCreate', slashUpdater(listener)(result))
      return result
    }
  }
}

const musicCommands = musicUpdater(music)(initialState)
const slashCommands = slashUpdater(slash)(initialState)

client.on('messageCreate', musicCommands)
client.on('interactionCreate', slashCommands)
