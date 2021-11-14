const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { 
	clientId, 
	gamingGoonery: guildId, 
	token 
} = require('./config.json')

const fs = require('fs')

const getCommands = () => {
	const commandFiles = fs.readdirSync('./commands')
		.filter(file => file.endsWith('.js'));

	return commandFiles.reduce((commands, file) => {
		const data = require(`./commands/${file}`)
			.data
			.toJSON()

		return [...commands, data]
	}, [])
}

const rest = new REST({ version: '9' }).setToken(token);

const deploy = async () => {
	const commands = getCommands()

	console.log('Started refreshing application (/) commands.')
	await rest.put(
		Routes.applicationGuildCommands(clientId, guildId),
		{ body: commands },
	)
	console.log('Successfully reloaded application (/) commands.')
}

deploy().catch(console.error)
