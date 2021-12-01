const { 
  createAudioPlayer, 
  joinVoiceChannel, 
  createAudioResource, 
  StreamType 
} = require("@discordjs/voice")

const ytdl = require("ytdl-core")

// ---------------------------------------------------

async function play({ link, channel, queue = [], ...state }) {
  const song = createSongFromLink(link)
  const connection = createConnection(channel)
  const player = createAudioPlayer()

  player.play(song.resource)

  const justPlayed = queue.findIndex(song => song.played === false)

  const updatedQueue = [
    ...queue.slice(0, justPlayed),
    { ...queue[justPlayed], played: true },
    ...queue.slice(justPlayed+1),
    song
  ]

  const [latest] = player.listeners()
  if(latest) player.removeListener(latest)

  player.on('stateChange', (old, curr) => {
    if(old.status === 'playing' && curr.status === 'idle') {
      const next = updatedQueue.findIndex(song => song.played === false)
      if(next !== undefined) player.play(updatedQueue[next])

      return
    }
  })

  return { connection, queue: updatedQueue, ...state }
}


async function makeStuff({ channel, link, queue, ...state }) {
  const resource = createSongFromLink(link)

  const { 
    player = createAudioPlayer(),
    connection = createConnection(channel)
  } = state

  let updatedQueue = []

  player.on('stateChange', (old, curr) => {
    if(curr.status === 'idle') {
      
      player.play(updatedQueue[0].resource)
    }
  })

  if(!resource) return state

  connection.subscribe(player)
  player.play(resource)

  return { ...state, connection, player, queue }
}

function stop({ player, connection, ...state }) {
  if(player) player.stop()
  if(connection) connection.destroy()
  return state
}

async function createSongFromLink(link) {
  try {
    const stream = ytdl(link, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
    })

    const title = await ytdl.getInfo(link)
      .then(res => res.videoDetails.title)
  
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    })

    resource.title = title

    return { title, resource, played: false }
  } catch(err) {
    console.log(`Resource creation failed: ${err}`);
    return
  }
}

function createConnection(channel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })
}

module.exports = {
  createSongFromLink,
  createConnection,
  play,
  stop
}
