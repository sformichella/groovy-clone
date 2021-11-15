const client = require('./client')
const { gamingGoonery } =  require('./config.json')

const { 
  joinVoiceChannel,
  createAudioResource, 
  createAudioPlayer, 
  StreamType,
} = require('@discordjs/voice');

const ytdl = require("ytdl-core");

const library = require('./library')

client.on('interactionCreate', async (interaction) => {
  if(!interaction.isCommand()) return

  const { commandName } = interaction

  if(commandName === 'play') {
    const channel = client
      .guilds.cache.get(gamingGoonery)
      .members.cache.get(interaction.user.id)
      .voice.channel

    const connection = createConnection(channel)

    const { link, reply = 'Playing!' } = getConfig(interaction)

    const resource = createResourceFromLink(link)

    const player = createAudioPlayer()
    
    connection.subscribe(player)
    player.play(resource)

    await interaction.reply(reply)

    player.on('stateChange', (old, current) => {
      if(current.status === 'idle') {
        player.stop()
        connection.destroy()
      }
    })
  }
})

function createResourceFromLink(link) {
  try {
    const stream = ytdl(link, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
    })
  
    return createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    })
  } catch (error) {
    console.error(error)
  }
}

function createConnection(channel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })
}

function getConfig(interaction) {
  const { name: option, value: name } = interaction.options.data[0]

  if(option === 'clip') return library.find(c => c.name === name)

  const link = interaction.options.data[0].value

  return { link }
}

// function parseLink(link) {

// }
