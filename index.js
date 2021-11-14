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

    const { link, execute } = getCommand(interaction)

    const resource = createResourceFromLink(link)

    const player = createAudioPlayer()
    connection.subscribe(player)
    player.play(resource)

    await execute(interaction)

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

function getCommand(interaction) {
  const sub = interaction.options.getSubcommand()
  const isFromLibrary = Object.keys(library).find(l => l === sub)

  if(isFromLibrary) return library[isFromLibrary]
}

// function parseLink(link) {

// }
