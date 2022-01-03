import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

import cmds from './listeners/slash/commands.js'

const slashCommands = Object.values(cmds)
	.reduce((cmds, cmd) => {
		return [...cmds, cmd.toJSON()]
	}, [])

const rest = new REST({ version: '9' })
const deploySlashCommands = async () => {
	console.log('Started refreshing application (/) commands.')
	await rest.put(
		Routes.applicationGuildCommands('917557108508074045', '916408532180537405'),
		{ body: slashCommands },
	)
	console.log('Successfully reloaded application (/) commands.')
}

deploySlashCommands().catch(console.error)
