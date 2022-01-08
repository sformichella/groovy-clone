import client from './client.js'
import heartbeat from './heartbeat.js';

import error from './middleware/error.js'
import message from './middleware/message.js'

import { generateDependencyReport } from "@discordjs/voice";

console.log(generateDependencyReport());

export const state = {}
const middleware = {
  message: message(client, state),
  logger: (message, res) => console.log(res),
  error
}

heartbeat()

client.on('messageCreate', promiseWrapper(middleware))

console.log('Listening...');

function promiseWrapper({ error, ...rest }) {
  return function (message) {
    return Object.values(rest)
      .reduce((res, middleware) => res.then(() => middleware(message, res)), Promise.resolve({}))
      .catch(e => error(message, e))
  }
}
