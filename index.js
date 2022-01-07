import { config } from 'dotenv';

config()

import client from './client.js'
import heartbeat from './heartbeat.js';

import error from './middleware/error.js'
import message from './middleware/message.js'

export const state = {}
const middleware = {
  message: message(client, state),
  error
}

heartbeat()

client.on('messageCreate', promiseWrapper(middleware))

console.log('Listening...');

function promiseWrapper({ errorMiddleware, ...rest }) {
  return function (message) {
    return Object.values(rest)
      .reduce((res, middleware) => res.then(() => middleware(message, res)), Promise.resolve({}))
      .catch(e => errorMiddleware(message, e))
  }
}
