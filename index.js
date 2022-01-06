import { joinVoiceChannel } from '@discordjs/voice';

import client from './client.js'
import Session from './session.js';

const staleInterval = 10 * 60 * 1000

const state = {}
const commandSymbol = '!'

console.log('Listening...');

setInterval(() => checkForStale(state), staleInterval)

const middlewares = {
  messageCommandMiddleware,
  errorMiddleware,
}

client.on('messageCreate', makeListener(middlewares))

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

function checkForStale(state) {
  const staleSessions = Object.entries(state)
    .reduce((out, [id, session]) => {
      if(session.stale) return { ...out, [id]: session }
      return out
    }, {})

  const staleString = Object.entries(staleSessions).reduce((string, [id, session]) => {
    return string + '\t' + `${session.guild} (${id})` + '\n'
  }, '')

  console.log(`Found ${Object.keys(staleSessions).length} stale sessions:${staleString}\nDeleting...`);

  Object.keys(staleSessions).forEach(guildId => delete state[guildId])

  const sessions = Object.entries(state).reduce((string, [id, session]) => {
    return string + '\t' + `${session.guild} (${id})` + '\n'
  }, '')

  console.log(`Current sessions:\n${sessions}`);
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
