const { Client, Intents } = require('discord.js')
const { token, gamingGoonery } = require('./config.json')

const { 
  joinVoiceChannel,
  createAudioResource, 
  createAudioPlayer, 
  StreamType,
} = require('@discordjs/voice');

const ytdl = require("ytdl-core");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
})

client.login(token)

client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return

  const { 
    commandName,
  } = interaction

  if(commandName === 'play') {
    const channel = client
      .guilds.cache.get(gamingGoonery)
      .members.cache.get(interaction.user.id)
      .voice.channel

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    })

    const player = createAudioPlayer()

    const rocketLawnChair = 'https://www.youtube.com/watch?v=7ljtZJ9g5zo'

    const stream = ytdl(rocketLawnChair, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
    });

    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    connection.subscribe(player)

    player.play(resource)

    player.on('stateChange', (old, current) => {
      if(current.status === 'idle') {
        connection.destroy()
      }
    })
  }
})
