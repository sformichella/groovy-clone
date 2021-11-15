const { SlashCommandBuilder } = require('@discordjs/builders')

const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop playback')

module.exports = {
  data
}
