import { state } from './index.js'

const pulse = 10 * 60 * 1000

function hearbeat() {
  return setInterval(() => checkForStale(state), pulse)
}

function checkForStale(state) {
  const staleSessions = Object.entries(state)
    .reduce((out, [id, session]) => {
      if(session.stale) return { ...out, [id]: session }
      return out
    }, {})

  const staleString = Object.entries(staleSessions).reduce((string, [id, session]) => {
    return string + '\t' + `${session.guild} (${id})` + '\n'
  }, '')

  console.log(`Found ${Object.keys(staleSessions).length} stale sessions:${staleString}\nDeleting...`);

  Object.keys(staleSessions).forEach(guildId => delete state[guildId])

  const sessions = Object.entries(state).reduce((string, [id, session]) => {
    return string + '\t' + `${session.guild} (${id})` + '\n'
  }, '')

  console.log(`Current sessions:\n${sessions}`);
}

export default hearbeat
