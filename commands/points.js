module.exports = {
	run: function(client, message, args) {
		/*
		const command = args.shift().toLowerCase();
		
		if (command === "get") {
			return message.channel.send(`You currently have ${client.points.get(key, "points")} points, and are level ${client.points.get(key, "level")}!`);
		}
		
		if(command === "leaderboard" || command === "lb") {
			// Get a filtered list (for this guild only), and convert to an array while we're at it.
			let filtered = client.points.array().filter( p => p.guild === message.guild.id );

			// Sort it to get the top results... well... at the top. Y'know.
			let sorted = filtered.sort((a, b) => a.points < b.points);

			let x = args[0] || 10;
			// Slice it, dice it, get the top 10 of it!
			let topx = sorted.splice(0, x);

			// Now shake it and show it! (as a nice embed, too!)
			const embed = new Discord.RichEmbed()
				.setTitle("Leaderboard")
				.setAuthor(client.user.username, client.user.avatarURL)
				.setDescription("Our top 10 points leaders!")
				.setColor(0x00AE86);
			for(let data of topx) {
				embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
			}
				return message.channel.send({embed});
		}*/
		return console.log("Points are disabled currently!");
	}
}

module.exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};

module.exports.help = {
	name: "points",
	category: "Miscelaneous",
	description: "Commands for points",
	usage: "points [command] [arguments]",
};