const { data: play } = require('./play')

const name = 'rocket-lawnchair'

const data = play
  .addSubcommand(subCommand => {
    return subCommand
      .setName(name)
      .setDescription('Play rocket launcher clip from Metal Slug')
  })

const execute = async (interaction) => {
  interaction.reply('Playing rocket lawnchair >:-)')
}

const link = 'https://www.youtube.com/watch?v=7ljtZJ9g5zo'

module.exports = { 
  data,
  execute,
  link,
  name
}
