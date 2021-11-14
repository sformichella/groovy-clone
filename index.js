const client = require('./client')
const { gamingGoonery } =  require('./config.json')

const { 
  joinVoiceChannel,
  createAudioResource, 
  createAudioPlayer, 
  StreamType,
} = require('@discordjs/voice');

const ytdl = require("ytdl-core");

client.on('interactionCreate', async (interaction) => {
  if(!interaction.isCommand()) return

  const { commandName } = interaction

  console.log('INTERACTION', interaction);

  if(commandName === 'play') {
    const channel = client
      .guilds.cache.get(gamingGoonery)
      .members.cache.get(interaction.user.id)
      .voice.channel

    const connection = createConnection(channel)
    const rocketLawnChair = createResourceFromLink('https://www.youtube.com/watch?v=7ljtZJ9g5zo')

    const player = createAudioPlayer()
    connection.subscribe(player)
    player.play(rocketLawnChair)

    await interaction.reply(`Playing rocket lawnchair >:-)`)

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

// function parseLink(link) {

// }
