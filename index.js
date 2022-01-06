import { joinVoiceChannel } from '@discordjs/voice';

import client from './client.js'
import heartbeat from './heartbeat.js';
import Session from './session.js';

export const state = {}
const commandSymbol = '!'

const middlewares = {
  messageCommandMiddleware,
  errorMiddleware,
}

heartbeat()

client.on('messageCreate', makeListener(middlewares))

console.log('Listening...');

async function messageCommandMiddleware(message) {
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

      const connection = createConnection(channel)
      
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

function errorMiddleware(message, error) {
  console.log('Something is broken!', error.message);
  console.log('---- Full error log ----');
  console.log(error);
}

function parse(content) {
  return content.split(' ')
}

function createConnection(channel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })
}



function makeListener(middlewares) {
  return function (message) {
    console.log('Making listener!');
    const { errorMiddleware, ...rest } = middlewares
    return Object.values(rest)
      .reduce((res, middleware) => res.then(() => middleware(message, res)), Promise.resolve())
      .catch(e => errorMiddleware(message, e))
  }
}
