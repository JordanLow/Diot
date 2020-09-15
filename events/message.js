module.exports = (client, message) => {
	// Botception bad
	if (message.author.bot) return;
	/* if (message.guild) {
		// Code for what was meant to be server points, ultimately served no use and is currently out of service until it is needed
		let key = `${message.guild.id}-${message.author.id}`;
		console.log(client.points.get(key));
		if (!client.points.get(key)) {
			console.log('d');
			client.points.set(key, {
				user: message.author.id,
				guild: message.guild.id,
				points: 0,
				level: 1
			});
		}
		client.points.set(key.points, key.points + 1);
		let curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, "points")));
		if (client.points.get(key, "level") < curLevel) {
			message.channel.send(`Level Up! You are now **${curLevel}**!`);
		}
		client.points.set(key, curLevel, "level");
	} */
	
	// Former points code, currently disabled
	

	/*
	Non-prefix messages are filtered out after this point. Add any non-prefix functionality here.
	*/

	if (message.content.indexOf(client.settings.get('prefix')) !== 0) return;

	// Break message into Command and Arguments
	const args = message.content.slice(client.settings.get('prefix').length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	// Check whether the command or alias exists in the Command Handler
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if (!cmd) return;

	// Return an error if DM-unavailable command is attempted in DMs.
	if (cmd && !message.guild && cmd.conf.guildOnly) { 
		return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");
	}
  
	message.flags = [];
	while (args[0] && args[0][0] === "-") {
		message.flags.push(args.shift().slice(1));
	}
	// Command flag functionality. Currently un-used, leaving here for future reference.

	cmd.run(client, message, args);
};
