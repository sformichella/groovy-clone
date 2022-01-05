import client from './client.js'
import Session from './session.js';

import { joinVoiceChannel } from '@discordjs/voice';

const staleInterval = 10 * 1000

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
    const guild =  client.guilds.cache.get(guildId).name
    
    const channel = client
    .guilds.cache.get(guildId)
    .members.cache.get(memberId)
    .voice.channel

    const connection = createConnection(channel)
    
    session = new Session({ guild, connection })
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

  if(command === 'stop') {
    const reply = session.stop()
    console.log(reply)
  }
})

function parse(content) {
  return content.split(' ')[0]
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
