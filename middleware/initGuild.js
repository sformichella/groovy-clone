import { getConfig, createConfig } from './guildConfig.js'

export default function init(client, state) {
  return async function (message) {
    const { guildId } = message
    const hasSession = state[guildId]
    
    if(!hasSession) {
      state[guildId] = {}

      const config = await getConfig({ guildId })

      if(!config) {
        return createConfig({ guildId })
          .then(config => config.commandSymbol)
          .then(commandSymbol => {
            state[guildId].commandSymbol = commandSymbol
            return
          })
      }

      state[guildId].commandSymbol = config.commandSymbol
      return config.commandSymbol
    }

    return
  }
}