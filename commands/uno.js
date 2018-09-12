const Uno = require('../game_files/uno.js');

module.exports = {
	run: function(client, message, args) {
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