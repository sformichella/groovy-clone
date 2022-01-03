import { guilds } from '../../client';

import { identity } from '../utils';
import { gamingGoonery } from '../../config.json';
import { find } from './library/index.json';

import { play, stop } from '../music/commands';

export default slashCommands

function slashCommands(interaction) {
  if(!interaction.isCommand()) return identity

  const { commandName: command } = interaction

  if(command === 'play') {
    const channel = guilds.cache.get(gamingGoonery)
      .members.cache.get(interaction.user.id)
      .voice.channel

    const { link, reply: defaultReply } = parseArgs(interaction)

    if(!link) return identity

    return async (state) => {
      const result = await play({ ...state, channel, link })
      const reply = defaultReply || `Playing: ${result.player.title}`
      await interaction.reply(reply)
      return result
    }
  }

  if(command === 'stop') return async state => {
    console.log('INTERACTION', interaction);
    const reply = 'Stopping playback'
    await interaction.reply(reply)
    return stop(state)
  }

  return identity
}

function parseArgs(interaction) {
  const { name: option, value: name } = interaction.options.data[0]

  if(option === 'clip') return find(c => c.name === name)

  if(option === 'link') return { link: name }

  return
}
