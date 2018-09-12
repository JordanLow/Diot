module.exports = (client, message) => {
	// It's good practice to ignore other bots. This also makes your bot ignore itself
	// and not get into a spam loop (we call that "botception").
	if (message.author.bot) return;
	/* if (message.guild) {
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

	// Also good practice to ignore any message that does not start with our prefix,
	// which is set in the configuration file.
	if (message.content.indexOf(client.settings.get('prefix')) !== 0) return;

	// Here we separate our "command" name, and our "arguments" for the command.
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	const args = message.content.slice(client.settings.get('prefix').length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	if (command == "jordansux") {
		return message.channel.send("Campion Sux");
	}
	// Check whether the command, or alias, exist in the collections defined
	// in app.js.
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	// using this const varName = thing OR otherthign; is a pretty efficient
	// and clean way to grab one of 2 values!
	if (!cmd) return;

	// Some commands may not be useable in DMs. This check prevents those commands from running
	// and return a friendly error message.
	if (cmd && !message.guild && cmd.conf.guildOnly) { 
		return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");
	}
  
	message.flags = [];
	while (args[0] && args[0][0] === "-") {
		message.flags.push(args.shift().slice(1));
	}

	cmd.run(client, message, args);
};