import { joinVoiceChannel } from '@discordjs/voice';

const commandSymbol = '!'
import Session from './session.js';

export default init

function init(client, state) {
  return function (message) {
    const {
      content,
      guildId,
      author: { id: memberId }
    } = message

    const isCommand = content[0] === commandSymbol
    if(!isCommand) return
    
    const [command, ...args] = parse(content.slice(1))

    let session = state[guildId]
    const stale = session === undefined || session.stale === true

    if(command === 'play') {
      if(stale) {
        const guild = client.guilds.cache.get(guildId).name
        
        const channel = client
          .guilds.cache.get(guildId)
          .members.cache.get(memberId)
          .voice.channel

        const connection = connect(channel)
        
        session = new Session({ guild, connection })
        state[guildId] = session
      }

      return session.play(args[0])
    }

    if(command === 'next') {
      if(stale) return
      const reply = session.next()
      return reply
    }

    if(command === 'stop') {
      if(stale) return
      const reply = session.stop()
      return reply
    }
  }
}


function parse(content) {
  return content.split(' ')
}

function connect(channel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })
}