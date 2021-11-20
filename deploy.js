const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const {
	clientId,
	gamingGoonery: guildId,
	token
} = require('./config.json')

const slashCommands = Object.values(require('./listeners/slash/commands.js'))
	.reduce((cmds, cmd) => [...cmds, cmd.toJSON()], [])

const rest = new REST({ version: '9' }).setToken(token);

const deploySlashCommands = async () => {
	console.log('Started refreshing application (/) commands.')
	await rest.put(
		Routes.applicationGuildCommands(clientId, guildId),
		{ body: slashCommands },
	)
	console.log('Successfully reloaded application (/) commands.')
}

deploySlashCommands().catch(console.error)
