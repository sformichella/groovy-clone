const { SlashCommandBuilder } = require('@discordjs/builders')

const library = require('../library/index.json')
const makePlaySubcommand = require('../utils/makeSubcommand')

const base = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play music')

const data = library.reduce((out, config) => {
  return base.addSubcommand(makePlaySubcommand(config))
}, base)

module.exports = {
  data
}