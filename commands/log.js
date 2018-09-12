module.exports = {
	run: function(client, message, args) {
		try {
			const out = client[args[0]];
			console.log("Logging out client." + args[0] + "...");
			console.log(out);
		} catch (e) {
			console.log(e);
		}
	}
};

module.exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['eval']
};

module.exports.help = {
	name: "log",
	category: "Troubleshooting",
	description: "EVAL command",
	usage: "log [command] [arguments]",
};