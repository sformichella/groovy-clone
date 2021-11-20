const { 
  createAudioPlayer, 
  joinVoiceChannel, 
  createAudioResource, 
  StreamType 
} = require("@discordjs/voice")

const ytdl = require("ytdl-core")

// ---------------------------------------------------

// Update to support queue!
async function play({ channel, link, ...state }) {
  const connection = createConnection(channel)
  const resource = createResourceFromLink(link)

  const title = await ytdl.getInfo(link)
    .then(res => res.videoDetails.title)

  const player = createAudioPlayer()
  player.title = title

  if(!resource) return state

  connection.subscribe(player)
  player.play(resource)

  return { ...state, connection, player }
}

function stop({ player, connection, ...state }) {
  if(player) player.stop()
  if(connection) connection.destroy()
  return state
}

function createResourceFromLink(link) {
  try {
    const stream = ytdl(link, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
    })
  
    return createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    })
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
  createResourceFromLink,
  createConnection,
  play,
  stop
}
