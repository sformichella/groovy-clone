import { joinVoiceChannel } from '@discordjs/voice';

import Session from '../session.js'
import { getConfig, updateCommandSymbol } from '../middleware/guildConfig.js'

export function play(client, data) {
  const { state, guildId, memberId, args } = data
  const { session } = state[guildId]

  const stale = session === undefined || session.stale === true

  if(stale) {
    const guild = client.guilds.cache.get(guildId).name
    
    const channel = client
      .guilds.cache.get(guildId)
      .members.cache.get(memberId)
      .voice.channel

    const connection = connect(channel)
    
    state[guildId].session = new Session({ guild, connection })
  }

  return state[guildId].session.play(args[0])
}

export function next(client, data) {
  const { state, guildId } = data
  const { session } = state[guildId]

  const stale = session === undefined || session.stale === true

  if(stale) return
  const reply = session.next()
  return reply
}

export function stop(client, data) {
  const { state, guildId } = data
  const { session } = state[guildId]

  const stale = session === undefined || session.stale === true

  if(stale) return
  const reply = session.stop()
  return reply
}

export function config(client, data) {
  const { state, guildId, args } = data

  if(args[0] === 'list') {
    if(args[1] === undefined) {
      return getConfig({ guildId })
        .then(config => {
          return {
            message: Object.entries(config)
            .reduce((out, [name, value]) => {
              return out + `\n${name}: ${value}`
            }, '')
          }
        })
    }
  }

  if(args[0] === 'set') {
    if(args[1] === 'command-symbol') {
      const current = state[guildId]
      const symbol = args[2]

      if(symbol === current) return

      const allowed = ['-', '!']

      if(!allowed.includes(symbol)) return { message: `Not a valid command symbol! Must be '!' or '-'` }
      return updateCommandSymbol({ guildId, commandSymbol: symbol }).then(config => {
        state[guildId].commandSymbol = config.commandSymbol
      })
    }
  }
}

function connect(channel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })
}
