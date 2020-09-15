module.exports = {
	run: function(client, message, args) {
		
		const command = args.shift().toLowerCase();

		if (command === "8ball" || command === "randans") {
			if (args.slice(0).join(" ").toLowerCase() == "is jordan gay?") {
				return message.channel.send("No but Earl definitely is :P");
			}
			let r = Math.floor(Math.random() * 8);
			switch(r){
				case 0:
					return message.channel.send("Concentrate and ask again");
					break;
				case 1:
					return message.channel.send("It is decidedly so");
					break;
				case 2:
					return message.channel.send("Without a doubt, Yes – definitely");
					break;
				case 3:
					return message.channel.send("You may rely on it");
					break;
				case 4:
					return message.channel.send("You may not rely on it");
					break;
				case 5:
					return message.channel.send("My reply is no");
					break;
				case 6:
					return message.channel.send("Very doubtful");
					break;
				case 7:
					return message.channel.send("Reply hazy, try again");
					break;
			}
		}

		if (command === "say") {
			const sayMessage = args.join(" ");
			return message.channel.send(sayMessage);
		}
	}
}

module.exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};

module.exports.help = {
	name: "bcommand",
	category: "Miscelaneous",
	description: "Bunch of basic commands",
	usage: "bcommand [command] [arguments]",
};