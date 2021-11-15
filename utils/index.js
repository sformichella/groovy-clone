const { joinVoiceChannel, createAudioResource, StreamType } = require("@discordjs/voice")
const ytdl = require("ytdl-core")

const library = require('../library')

module.exports = {
  makePlaySubcommand,
  createResourceFromLink,
  createConnection,
  getConfig,
  parseArgs
}

function makePlaySubcommand(config) {
  const { name, description } = config

  return subcommand => {
    return subcommand
      .setName(name)
      .setDescription(description)
  }
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

function parseArgs(args) {
  const commands = [
    'play',
    'stop'
  ]

  const command = commands.find(c => c === args[0]) || 'play'
  const remaining = (command === args[0] ? args.slice(1) : args).join(' ')
  return `${command} ${remaining}`
}
