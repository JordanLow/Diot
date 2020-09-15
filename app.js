// Load up the discord.js library
const Discord = require("discord.js");
const fs = require("fs");
const { promisify } = require("util");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
// If loading this from github, the config file is gitignored as the token is within. Copy in an appropriate file and title it "config.json".
client.config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.game = null;

client.settings = new Discord.Collection();
client.settings.set('prefix', client.config.prefix);

client.on("ready", () => {
	// This event will run if the bot starts, and logs in, successfully.
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`); 
	// Example of changing the bot's playing game to something useful. `client.user` is what the
	// docs refer to as the "ClientUser".
	client.user.setActivity(`${client.guilds.cache.size}x taking care of me`);
});

client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`${client.guilds.cache.size}x taking care of me`);
});

client.on("guildDelete", guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`${client.guilds.cache.size}x taking care of me`);
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
			/* if (props.init) {
				props.init(client);
			} No program currently uses this. Leaving this here for future reference */
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
		client.on(eventName, event.bind(null, client)); // Event binding. Don't touch unnecessarily, idk how to solve unexpected behaviour here.
		const mod = require.cache[require.resolve(`./events/${file}`)];
		delete require.cache[require.resolve(`./events/${file}`)];
		for (let i = 0; i < mod.parent.children.length; i++) {
			if (mod.parent.children[i] === mod) {
			mod.parent.children.splice(i, 1);
			break;
			}
		}
		// Even more cache/export/require magicery. Also don't touch because idk how to solve unexpected behaviour here.
	});

	// Here we login the client.
	client.login(client.config.token);

// End top-level async/await function.
};

init();
