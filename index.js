import { joinVoiceChannel } from '@discordjs/voice';

import client from './client.js'
import hearbeat from './heartbeat.js';
import Session from './session.js';

export const state = {}
const commandSymbol = '!'

const middlewares = {
  messageCommandMiddleware,
  errorMiddleware,
}

hearbeat()

client.on('messageCreate', makeListener(middlewares))

console.log('Listening...');

function messageCommandMiddleware(message) {
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

    const reply = session.play(args[0])
    console.log(reply);
  }

  if(command === 'next') {
    if(stale) return
    const reply = session.next()
    console.log(reply);
  }

  if(command === 'stop') {
    if(stale) return
    const reply = session.stop()
    console.log(reply)
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
    const { errorMiddleware, ...rest } = middlewares
    try {
      return Object
        .values(rest)
        .reduce((res, middleware) => middleware(message, res), {})
    } catch(error) {
      return errorMiddleware(message, error)
    }
  }
}
