module.exports = {
	run: function(client, message, args) {
		
		if (args.length == 0) {
			return message.channel.send(`\`Usage: reload [command]\` \n More detailed help pages in the works!`);
		}
		
		const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

		if (!command) return message.channel.send(`Can't find \`${commandName}\`, did you make a mistake?`);

		delete require.cache[require.resolve(`./${command.help.name}.js`)];
		try {
			var newCommand = require(`./${command.help.name}.js`);
			client.commands.set(newCommand.help.name, newCommand);
			newCommand.conf.aliases.forEach(alias => {
				client.aliases.set(alias, newCommand.help.name);
			});
			message.channel.send(`\`${command.help.name}\` refreshed and reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(`There was an error while reloading a command \`${command.help.name}.js\`:\n\`${error.message}\``);
		}
	}
}

module.exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['hotfix', 'hotpatch']
};

module.exports.help = {
	name: 'reload',
	category: "Miscelaneous",
	description: 'Reloads the cache for a command to reflect changes',
	usage: "reload [command]"
};