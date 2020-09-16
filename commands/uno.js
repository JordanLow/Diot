const Uno = require('../game_files/uno.js');

module.exports = {
	run: function(client, message, args) {
		
		if (args.length == 0) {
			return message.channel.send(`\`Usage: uno [command] [arguments]\` \n More detailed help pages in the works!`);
		}
		
		const command = args.shift().toLowerCase();

		try {
			Uno[command](client, message, args);
		} catch(e) {
			console.log(e);
		}
	}
};

module.exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};

module.exports.help = {
	name: "uno",
	category: "Game",
	description: "Uno commands",
	usage: "uno [command] [arguments]",
};