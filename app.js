// Load up the discord.js library
const Discord = require("discord.js");
const fs = require("fs");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const { promisify } = require("util");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
client.config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.commands = new Enmap();
client.aliases = new Enmap();
client.points = new Enmap({name: "points"});
client.game = null;

client.settings = new Enmap({provider: new EnmapLevel({name: "settings"})});
client.settings.set('prefix', client.config.prefix);

client.on("ready", () => {
	// This event will run if the bot starts, and logs in, successfully.
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	// Example of changing the bot's playing game to something useful. `client.user` is what the
	// docs refer to as the "ClientUser".
	client.user.setActivity(`Being ${client.guilds.size}x better than Jordan`);
});

client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`Being ${client.guilds.size}x better than Jordan`);
});

client.on("guildDelete", guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Being ${client.guilds.size}x better than Jordan`);
});

const readdir = promisify(fs.readdir);

const init = async () => {

	// Here we load **commands** into memory, as a collection, so they're accessible
	// here and everywhere else.
	const cmdFiles = await readdir("./commands/");
	cmdFiles.forEach(f => {
		if (!f.endsWith(".js")) return;
		try {
			const props = require(`./commands/${f}`);
			if (props.init) {
				props.init(client);
			}
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name);
			});
			return false;
		} catch (e) {
			console.log(`Unable to load command ${f}: ${e}`)
		}
	});

	// Then we load events, which will include our message and ready event.
	const evtFiles = await readdir("./events/");
	evtFiles.forEach(file => {
		const eventName = file.split(".")[0];
		const event = require(`./events/${file}`);
		// This line is awesome by the way. Just sayin'.
		client.on(eventName, event.bind(null, client));
		const mod = require.cache[require.resolve(`./events/${file}`)];
		delete require.cache[require.resolve(`./events/${file}`)];
		for (let i = 0; i < mod.parent.children.length; i++) {
			if (mod.parent.children[i] === mod) {
			mod.parent.children.splice(i, 1);
			break;
			}
		}
	});

	// Here we login the client.
	client.login(client.config.token);

// End top-level async/await function.
};

init();