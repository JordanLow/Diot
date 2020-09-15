module.exports = {
	run: function(client, message, args) {

		const command = args.shift().toLowerCase();

		if (command === "create") {

			var name = args.shift();
			var dserver = message.guild;
			var options = {};
			
			options.type = args.shift().toLowerCase();

			var category = false;
			if (args.length > 0) {
				category = args.join(' ').toLowerCase();
			}
			
			dserver.channels.create(name, options)
			.then(
				async (child) => {
					if (category) {
						var channels = dserver.channels.cache;
						if (!channels.find( channel => channel.type === 'category' && channel.name.toLowerCase() === category )) {
							await dserver.channels.create(category, { type: 'category' }).then(console.log).catch(console.error);
						}
						formerchild = channels.find(channel => channel.type === 'category' && channel.name.toLowerCase() === category);
						child.setParent(formerchild).then(console.log).catch(console.error);
					}
				}
			)
			.catch(console.error);

		}
		
		if (command === "delete") {
			var name = args.shift().toLowerCase();
			var dserver = message.guild;
			var channels = dserver.channels.cache;
			var category = false;
			if (args.length > 0) {
				category = args.join(' ').toLowerCase();
			}
			if (category) {
				channels.find( channel => channel.type !== 'category' && channel.name.toLowerCase() === name && channel.parent.name.toLowerCase() == category ).delete()
				.then(console.log).catch(console.error);
			} else {
				channels.find( channel => channel.name.toLowerCase() === name ).delete()
				.then(console.log).catch(console.error);
			}
			
		}
	}
}

module.exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};

module.exports.help = {
	name: "channel",
	category: "Miscelaneous",
	description: "Create text channels",
	usage: "channel [command] [arguments]",
};