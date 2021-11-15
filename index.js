const client = require('./client');
const useMessageCommands = require('./middleware/messageCommands');

const useSlashCommands = require('./middleware/slashCommands');

client.on('messageCreate', useMessageCommands)
client.on('interactionCreate', useSlashCommands)
