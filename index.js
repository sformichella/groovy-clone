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

    const { link, reply } = getConfig(interaction)

    const resource = createResourceFromLink(link)

    const player = createAudioPlayer()
    connection.subscribe(player)
    player.play(resource)

    await interaction.reply(reply)

    player.on('stateChange', (old, current) => {
      if(current.status === 'idle') {
        connection.destroy()
        player.stop()
      }
    })
  }
})

function createResourceFromLink(link) {
  const stream = ytdl(link, {
    filter: "audioonly",
    highWaterMark: 1 << 25,
  });

  return createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });
}

function createConnection(channel) {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  })
}

function getConfig(interaction) {
  const sub = interaction.options.getSubcommand()
  const isFromLibrary = library.find(l => l.name === sub)

  if(isFromLibrary) return isFromLibrary
}

// function parseLink(link) {

// }
