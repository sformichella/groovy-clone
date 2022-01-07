import init from './client.js'
import heartbeat from './heartbeat.js';

import error from './middleware/error.js'
import message from './middleware/message.js'

export const state = {}

const middleware = {
  message: message(client, state),
  error
}

heartbeat()
const client = init()

// client.on('messageCreate', promiseWrapper(middleware))
client.on('messageCreate', console.log)

console.log('Listening...');

function promiseWrapper({ errorMiddleware, ...rest }) {
  return function (message) {
    return Object.values(rest)
      .reduce((res, middleware) => res.then(() => middleware(message, res)), Promise.resolve({}))
      .catch(e => errorMiddleware(message, e))
  }
}
