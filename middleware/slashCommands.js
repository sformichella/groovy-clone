const { createAudioPlayer } = require('@discordjs/voice');

const client = require('../client')
const { createConnection, getConfig, createResourceFromLink } = require('../utils');
const { gamingGoonery } =  require('../config.json')


module.exports = useSlashCommands

async function useSlashCommands(interaction) {
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
}



