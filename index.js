const client = require('./client');

const slash = require('./listeners/slash');
const music = require('./listeners/music')

const initialState = { queue: [] }

function addListener(client, ) {

}

const musicUpdater = listener => {
  return state => {
    return async message => {
      const result = await listener(message)(state)

      const [oldListener] = client.listeners('messageCreate')
      
      client.removeListener('messageCreate', oldListener)

      const newListener = async message => {
        return musicUpdater(listener)(result)(message).catch(console.log)
      }
      
      client.on('messageCreate', newListener)
      return result
    }
  }
}

const slashUpdater = listener => {
  return state => {
    return async interaction => {
      const result = await listener(interaction)(state)

      const [oldListener] = client.listeners('interactionCreate')

      client.removeListener('interactionCreate', oldListener)

      const newListener = async interaction => {
        return slashUpdater(listener)(result)(interaction).catch(console.log)
      }

      client.on('interactionCreate', newListener)
      return result
    }
  }
}

const musicCommands = musicUpdater(music)(initialState)
const slashCommands = slashUpdater(slash)(initialState)

client.on('messageCreate', musicCommands)
client.on('interactionCreate', slashCommands)
