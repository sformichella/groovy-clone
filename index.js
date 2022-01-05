import client from './client.js'
import Session from './session.js';

import { joinVoiceChannel } from '@discordjs/voice';

const staleInterval = 10 * 60 * 1000

const state = {}
const commandSymbol = '!'

console.log('Listening...');

setInterval(() => checkForStale(state), staleInterval)

client.on('messageCreate', message => {
  const {
    content,
    guildId,
    author: { id: memberId }
  } = message

  const command = parse(content)

  // const isCommand = true
  // if(!isCommand) return

  let session = state[guildId]
  const needsInit = session === undefined || session.stale === true

  if(needsInit) {
    const channel = client
      .guilds.cache.get(guildId)
      .members.cache.get(memberId)
      .voice.channel

    const connection = createConnection(channel)
    
    session = new Session({ connection })
    state[guildId] = session
  }

  if(command === 'play') {
    const link = content.split(' ')[1]

    const reply = session.play(link)

    console.log(reply);
  }

  if(command === 'next') {
    const reply = session.next()

    console.log(reply);
  }
})

function parse(content) {
  return content.split(' ')[0]
}

function checkForStale(state) {
  const staleSessions = Object.keys(state)
    .filter(guildId => state[guildId].stale === true)

  const staleString = staleSessions.reduce((string, id) => {
    return string + '\t' + id + '\n'
  }, '')

  console.log(`Found ${staleSessions.length} stale sessions:${staleString}\nDeleting...`);

  staleSessions.forEach(guildId => delete state[guildId])
}

function createConnection(channel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })
}


