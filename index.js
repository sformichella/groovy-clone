import client from './client.js'
import heartbeat from './heartbeat.js';

import error from './middleware/error.js'
import message from './middleware/message.js'
import initGuild from './middleware/initGuild.js'

export const state = {}

const messageMiddleware = {
  initGuild: initGuild(client, state),
  message: message(client, state),
  logger: (message, res) => console.log(res),
  error
}

heartbeat()

client.on('messageCreate', promiseWrapper(messageMiddleware))

console.log('Listening...');

function promiseWrapper({ error, ...rest }) {
  return function (message) {
    return Object.values(rest)
      .reduce((res, middleware) => res.then(() => middleware(message, res)), Promise.resolve({}))
      .catch(e => error(message, e))
  }
} 
