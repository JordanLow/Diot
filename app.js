// Load Dependencies
const Discord = require("discord.js");
const fs = require("fs");
const { promisify } = require("util");

// Boot up the bot
const client = new Discord.Client();

// Load config.json which contains our configuration settings.
// If loading this from github, the config file is gitignored as the token is within. Copy in an appropriate file and title it "config.json".
client.config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

// Boot up the Command Handler and configure bot settings.
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.settings = new Discord.Collection();
client.settings.set('prefix', client.config.prefix);

// Initialize variables
client.game = null;
client.tchannels = new Discord.Collection();


client.on("ready", () => {
	// Sets the bot profile upon successful login
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`); 
	client.user.setActivity(`${client.guilds.cache.size}x servers taking care of me`);
});

client.on("guildCreate", guild => {
	// Updates the bot profile upon joining a server
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`${client.guilds.cache.size}x servers taking care of me`);
});

client.on("guildDelete", guild => {
	// Updates the bot profile upon leaving a server
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`${client.guilds.cache.size}x servers taking care of me`);
});

const readdir = promisify(fs.readdir);

const init = async () => {

	// Load commands in the Command Handler. Caching it like this = Cleaner filesystem :D
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
			// Load command aliases too!
			return false;
		} catch (e) {
			console.log(`Unable to load command ${f}: ${e}`)
		}
	});

	// Load events and bind them. I'm trusting the internet on this one so don't touch it unneccessarily.
	const evtFiles = await readdir("./events/");
	evtFiles.forEach(file => {
		const eventName = file.split(".")[0];
		const event = require(`./events/${file}`);
		client.on(eventName, event.bind(null, client)); // Event binding. Again, don't touch unnecessarily, idk how to solve unexpected behaviour here.
		const mod = require.cache[require.resolve(`./events/${file}`)];
		delete require.cache[require.resolve(`./events/${file}`)];
		for (let i = 0; i < mod.parent.children.length; i++) {
			if (mod.parent.children[i] === mod) {
			mod.parent.children.splice(i, 1);
			break;
			}
		}
		// Even more cache/export/require magicery. FINAL don't touch because I really don't know how to solve unexpected behaviour here.
	});

	// Log the bot in!
	client.login(client.config.token);
};

init();
