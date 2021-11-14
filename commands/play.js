const { SlashCommandBuilder } = require('@discordjs/builders')

const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play music')

module.exports = {
  data
}