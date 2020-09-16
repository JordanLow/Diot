module.exports = {
	run: function(client, message, args) {
		
		if (args.length == 0) {
			return message.channel.send(`\`Usage: channel [command] [arguments]\` \n More detailed help pages in the works!`);
		}
		
		const command = args.shift().toLowerCase();
		
		if (command === 'ctc') {
			var timer1 = parseInt(args.shift());
			var timer2 = parseInt(args.shift());
			var name = args.shift();
			var dserver = message.guild;
			var options = {};
			
			options.type = args.shift().toLowerCase();

			var category = false;
			if (args.length > 0) {
				category = args.join(' ').toLowerCase();
			}
			
			setTimeout( () => dserver.channels.create(name, options)
			.then(
				async (child) => {
					client.tchannels.set(name, child);
					if (category) {
						var channels = dserver.channels.cache;
						if (!channels.find( channel => channel.type === 'category' && channel.name.toLowerCase() === category )) {
							await dserver.channels.create(category, { type: 'category' }).then( cat => client.tchannels.set(category, cat) ).catch(console.error);
						}
						formerchild = channels.find(channel => channel.type === 'category' && channel.name.toLowerCase() === category);
						child.setParent(formerchild).then(console.log).catch(console.error);
					}
					setTimeout( () => { client.tchannels.forEach( (tc) => tc.delete() ) }, timer2);
				}
			)
			.catch(console.error), timer1)
		}
		
		if (command === 'ct') {
			var timer = parseInt(args.shift());
			var name = args.shift();
			var dserver = message.guild;
			var options = {};
			
			options.type = args.shift().toLowerCase();

			var category = false;
			if (args.length > 0) {
				category = args.join(' ').toLowerCase();
			}
			
			setTimeout( () => dserver.channels.create(name, options)
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
			.catch(console.error), timer)
		}
		
		if (command === "tc") {
			var timer = parseInt(args.shift());
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
					client.tchannels.set(name, child);
					if (category) {
						var channels = dserver.channels.cache;
						if (!channels.find( channel => channel.type === 'category' && channel.name.toLowerCase() === category )) {
							await dserver.channels.create(category, { type: 'category' }).then( cat => client.tchannels.set(category, cat) ).catch(console.error);
						}
						formerchild = channels.find(channel => channel.type === 'category' && channel.name.toLowerCase() === category);
						child.setParent(formerchild).then(console.log).catch(console.error);
					}
					setTimeout( () => { client.tchannels.forEach( (tc) => tc.delete() ) }, timer);
				}
			)
			.catch(console.error);
		}

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
	description: "Manage text channels",
	usage: "channel [command] [arguments]",
};