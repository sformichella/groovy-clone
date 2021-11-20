const { SlashCommandBuilder } = require('@discordjs/builders')

const library = require('./library/index.json')

const play = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play music')
  .addStringOption(option => {
    return option
      .setName('link')
      .setDescription('Song link - youtube or spotify')
  })
  .addStringOption(option => {
    const base = option
      .setName('clip')
      .setDescription('A clip from our library')
    
      return library.reduce((out, { name }) => {
        return out.addChoice(name, name)
      }, base)
  })

const stop = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop playback')

module.exports = { play, stop }
