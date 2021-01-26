module.exports = {
	run: function(client, message, args) {
		if (args.length == 0) {
			return message.channel.send(`\`Usage: role [rolename] [members]\` \n More detailed help pages in the works!`);
		}
		
		const command = args.shift().toLowerCase();
		
		if (command === 'add') {
			let rolename = args.shift().toLowerCase();
	
			let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === rolename)

			let member = message.mentions.members.first();

			return member.roles.add(role)
		}
	}
}

module.exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['r']
};

module.exports.help = {
	name: "role",
	category: "Miscelaneous",
	description: "Manage roles",
	usage: "role [rolename] [members]",
};