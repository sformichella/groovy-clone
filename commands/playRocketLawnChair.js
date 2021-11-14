const { SlashCommandBuilder } = require('@discordjs/builders')

const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play music')
  .addSubcommand(subCommand => {
    return subCommand
      .setName('rocket-lawnchair')
      .setDescription('Play rocket launcher clip from Metal Slug')
  })

const execute = interation => {

}

module.exports = { data }
