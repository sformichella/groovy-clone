import { create, read, update } from '../models/guildConfig.js'

export function createConfig({ guildId }) {
  const defaultCommandSymbol = '!'

  return create({ guildId, commandSymbol: defaultCommandSymbol })
}

export function getConfig({ guildId }) {
  return read({ guildId })
}

export function getCommandSymbol({ guildId }) {
  return read({ guildId }).then(row => row.commandSymbol)
}

export function updateCommandSymbol({ guildId, commandSymbol }) {
  return update({ guildId, commandSymbol })
}
