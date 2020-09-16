module.exports = {
	run: function(client, message, args) {
		
		if (args.length == 0) {
			return message.channel.send(`\`Usage: morse [encode/decode] [message]\` \n More detailed help pages in the works!`);
		}
		
		const command = args.shift().toLowerCase();
		const alphabet = {  
			"-----":"0",
			".----":"1",
			"..---":"2",
			"...--":"3",
			"....-":"4",
			".....":"5",
			"-....":"6",
			"--...":"7",
			"---..":"8",
			"----.":"9",
			".-":"a",
			"-...":"b",
			"-.-.":"c",
			"-..":"d",
			".":"e",
			"..-.":"f",
			"--.":"g",
			"....":"h",
			"..":"i",
			".---":"j",
			"-.-":"k",
			".-..":"l",
			"--":"m",
			"-.":"n",
			"---":"o",
			".--.":"p",
			"--.-":"q",
			".-.":"r",
			"...":"s",
			"-":"t",
			"..-":"u",
			"...-":"v",
			".--":"w",
			"-..-":"x",
			"-.--":"y",
			"--..":"z",
			"-.-.--":"!",
			".-.-.-":".",
			"--..--":","
		};
		const dot = "<:Morse_Campion_Short:403903208595914762>";
		const dash = "<:Morse_Campion_SLONG:513704590294646787>";
		const space = "<:Morse_Campion_Divider:513705672198717455>";
		if (command == "decode") {
			for (let i = 0; i < args.length; i++) {
				if (args[i] == dot) {
					args[i] = ".";
				} else if (args[i] == dash) {
					args[i] = "-";
				} else if (args[i] == space) {
					args[i] = "/";
				}
			}
			args = args.join("").split("/");
			for (let i = 0; i < args.length; i++) {
				args[i] = alphabet[args[i]];
			}
			return message.channel.send(args.join(""));
		} else if (command == "encode") {
			args = args.join("").split("");
			var output = ""
			for (let i = 0; i < args.length; i++) {
				let key = Object.keys(alphabet).find(key => alphabet[key] === args[i]).split("");
				for (let j = 0; j < key.length; j++) {
					if (key[j] == ".") {
						key[j] = dot;
					} else if (key[j] == "-") {
						key[j] = dash;
					}
				}
				output = output + key.join(" ") + " " + space + " ";
			}
			return message.channel.send(output);
		}
	}
}

module.exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};

module.exports.help = {
	name: "morse",
	category: "Language",
	description: "Translate Campion Morse (TM)",
	usage: "morse [message]",
};