import { SlashCommandBuilder } from '@discordjs/builders'

// import library from './library/index.json'
const library = [{
  "name": "rocket-lawnchair",
  "description": "Play rocket launcher clip from Metal Slug",
  "link": "https://www.youtube.com/watch?v=7ljtZJ9g5zo",
  "reply": "RAWK IT LAWN CHAIR"
}]

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

export default { play, stop }
