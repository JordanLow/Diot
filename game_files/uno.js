const Game = require('./game.js');

class Uno extends Game.game {
	constructor(){
		super("UNO");
		this.players = [];
		this.currentTurn = null;
		this.deck = [];
		this.createDeck();
		this.state = 0;
		this.activeCard = {rank: null, suit: null};
		this.stack = [];
	}
	
	start() {
		while (!(this.activeCard.rank in ['0', '1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '7', '7', '8', '8', '9', '9'])) {
			this.activeCard = this.deck.shift();
		}
		this.players = this.shuffle(this.players)
		this.currentTurn = this.players[0];
		for (let i in this.players){
			this.players[i].cards = this.deal(7);
			for (let k in this.players[i].cards) {
				this.players[i].cards[k].index = (parseInt(k) + 1).toString();
			}
			this.players[i].handMSG = this.players[i].user.send(';P');
		}
		this.activeCard = this.deck.shift();
		return this.activeCard;
	}

	shuffle(array) {
		let currentIndex = array.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {

			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
	
	createDeck() {
		let suits = ["Red", "Green", "Yellow", "Blue"];
		let ranks = ['0', '1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '7', '7', '8', '8', '9', '9', 'Draw +2', 'Draw +2', 'Skip', 'Skip', 'Reverse', 'Reverse'];
		let wilds = ['Wild', 'Wild', 'Wild', 'Wild', 'Wild Draw +4', 'Wild Draw +4', 'Wild Draw +4', 'Wild Draw +4'];
		
		let deck = suits.map(i => {
			let suitrank = [];
			for (let k in ranks) {
				suitrank.push({ suit: i, rank: ranks[k] });
			};
			return suitrank;
		})
		
		for (let j in wilds) {
			let W = [];
			let WF = [];
			if (j == 'Wild') {
				W.push({suit: 'Wild', rank: '-'})
			} else if (j == 'Wild Draw +4') {
				WF.push({suit: 'Wild', rank: 'Draw +4'})
			}
			deck.push(W);
			deck.push(WF);
		}
		
		this.deck = this.shuffle([].concat.apply([], deck));
		
		return this.deck;
	}
	
	reshuffle() {
		this.deck = this.shuffle(this.stack);
		return this.deck;
	}
	
	deal(size) {
		let hand = this.deck.splice(0, size);
		
		return hand;
	}
	
	legalPlay(card) {
		if (card.rank == this.activeCard.rank || card.suit == this.activeCard.suit) {
			return true
		} else {
			return false
		}
	}
	
	cardDraw(player) {
		let x = this.players.findIndex(function(obj){return obj == player;});
		this.players[x].cards.push(this.deck.shift());
		for (let k in this.players[x].cards) {
			this.players[x].cards[k].index = (parseInt(k) + 1).toString();
		}
		this.currentTurn = this.players[x];
	}
	
	onCardPlay(player, card) {
		let x = this.players.findIndex(function(obj){return obj == player;});
		this.stack.push(this.activeCard);
		this.players[x].cards.splice(this.players[x].cards.findIndex(function(obj){return obj.index == card.index;}), 1);
		for (let k in this.players[x].cards) {
			this.players[x].cards[k].index = (parseInt(k) + 1).toString();
		}
		this.activeCard = card;
		this.currentTurn = this.players[x];
		return this.activeCard;
	}
	
	cardPlayed(player) {
		if (player == this.players[this.players.length - 1]) {
			this.currentTurn = this.players[0];
		} else {
			this.currentTurn = this.players[this.players.findIndex(function(obj){return obj == player;}) + 1];
		}
		let out = this.resolve(this.currentTurn) || false;
		return out;
	}
	
	resolve(player) {
		let x = this.players.findIndex(function(obj){return obj == player;});
		if (this.activeCard.rank == 'Draw +2') {
			this.cardDraw(this.players[x]);
			this.cardDraw(this.players[x]);
			if (player == this.players[this.players.length - 1]) {
				this.currentTurn = this.players[0];
			} else {
				this.currentTurn = this.players[x + 1];
			}
			return `${player.user.username} Draws 2 Cards, Skips a Turn`;
		} else if (this.activeCard.rank == 'Skip') {
			if (player == this.players[this.players.length - 1]) {
				this.currentTurn = this.players[0];
			} else {
				this.currentTurn = this.players[x + 1];
			}
			return `${player.user.username} Skips a Turn`;
		}
		if (this.activeCard.rank == 'Reverse') {
			if (this.players.length < 3) {
				if (player == this.players[this.players.length - 1]) {
					this.currentTurn = this.players[0];
				} else {
					this.currentTurn = this.players[x + 1];
				}
				return `${player.user.username} Skips a Turn (Reverse in 2 Player)`;
			} else {
				if (x - 2 >= 0) {
					this.currentTurn = this.players[x - 2];
				} else {
					this.currentTurn = this.players[x + (x - 2)];
				}
				this.players.reverse();
				return `Turn Order has been Reversed!`;
			}
		}
	}
	
	playerWin(player) {
		if (player.cards.length == 0) {
			return true
		} else {
			return false
		}
	}
}

module.exports = {
	players: function (client, message, args) {
		if (!client.game) {
			return message.channel.send("There is no game!!");
		} else {
			var out = "";
			for (var i in client.game.players) {
				out = out + ", " + client.game.players[i].user.username;
			}
			return message.channel.send(`Players: ${out.slice(2)}`);
		}
	},
	signups: function (client, message, args) {
		if (!client.game) {
			client.game = new Uno()
			client.game.state = 1;
			return message.channel.send("Who wants to play some UNO?");
		} else {
			return message.channel.send(`There is already a game of ${client.game.game}!`)
		}
	},
	join: function (client, message, args) {
		if (!client.game) {
			return message.channel.send("There is no game!!");
		} else if (client.game.state != 1) {
			return message.channel.send(`There is already an ongoing game of ${client.game.game}!`);
		} else {
			let player = new Game.player(message.author, 'UNO');
			if (client.game.canAddPlayer(player)) {
				client.game.players.push(player);
			} else {
				return message.channel.send("You have already joined!")
			}
			return message.channel.send(`${player.user.username} has joined the game!`);
		}
 	},
	start: function (client, message, args) {
		if (!client.game) {
			return message.channel.send("There is no game!!");
		} else if (client.game.state != 1) {
			return message.channel.send(`There is already an ongoing game of ${client.game.game}!`);
		} else {
			client.game.state = 2;
			message.channel.send("A game of UNO is starting!");
			client.game.start();
			for (let i in client.game.players) {
				var hand = "";
				for (let k in client.game.players[i].cards) {
					hand = hand + `, ${client.game.players[i].cards[k].index}: \`\`${client.game.players[i].cards[k].suit} ${client.game.players[i].cards[k].rank}\`\``;
				}
				Promise.resolve(client.game.players[i].handMSG)
					.then(msg => msg.edit(hand.slice(2)));
			}
			return message.channel.send(
				{embed: {
					color: 3447003,
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					title: "Starting Card!",
					description: `${client.game.activeCard.suit} ${client.game.activeCard.rank}`,
					fields: [{
						name: "Current Turn",
						value: `${client.game.currentTurn.user.username}`
					}]
				}
			})
		}
	},
	draw: function (client, message, args) {
		if (!client.game) {
			return message.channel.send("There is no game!!");
		} else if (client.game.state != 2) {
			return message.channel.send(`There isn't a game of ${client.game.game}!`);
		} else if (client.game.currentTurn.user != message.author) {
			return message.channel.send(`It is not your turn!`);
		} else {
			if (client.game.deck.length < 1){
				client.game.reshuffle();
			}
			client.game.cardDraw(client.game.currentTurn);
			var hand = "";
			for (let k in client.game.currentTurn.cards) {
				hand = hand + `, ${client.game.currentTurn.cards[k].index}: \`\`${client.game.currentTurn.cards[k].suit} ${client.game.currentTurn.cards[k].rank}\`\``;
			}
			return Promise.resolve(client.game.currentTurn.handMSG).then(msg => msg.edit(hand.slice(2)));
		}
	},
	play: function (client, message, args) {
		if (!client.game) {
			return message.channel.send("There is no game!!");
		} else if (client.game.state != 2) {
			return message.channel.send(`There isn't a game of ${client.game.game}!`);
		} else if (client.game.currentTurn.user != message.author) {
			return message.channel.send(`It is not your turn!`);
		} else {
			if (!client.game.legalPlay(client.game.currentTurn.cards[args[0] - 1])) {
				return message.channel.send(`Illegal move!!`)
			}
			message.channel.send(`Card Played: ${client.game.currentTurn.cards[args[0] - 1].suit} ${client.game.currentTurn.cards[args[0] - 1].rank}`);
			client.game.onCardPlay(client.game.currentTurn, client.game.currentTurn.cards[args[0] - 1]);
			if (client.game.playerWin(client.game.currentTurn)) {
				message.channel.send(`\_\_Game Over: All Hail ${client.game.currentTurn.user.username}\_\_`);
				client.game = false;
				return message.channel.send(`Good Game :D`);
			}
			var hand = "";
			for (let k in client.game.currentTurn.cards) {
				hand = hand + `, ${client.game.currentTurn.cards[k].index}: \`\`${client.game.currentTurn.cards[k].suit} ${client.game.currentTurn.cards[k].rank}\`\``;
			}
			Promise.resolve(client.game.currentTurn.handMSG)
				.then(msg => msg.edit(hand.slice(2)));
			message.channel.send(client.game.cardPlayed(client.game.currentTurn));
			return message.channel.send(
				{embed: {
					color: 3447003,
					author: {
						name: client.user.username,
						icon_url: client.user.avatarURL
					},
					title: "Current Card!",
					description: `${client.game.activeCard.suit} ${client.game.activeCard.rank}`,
					fields: [{
						name: "Current Turn",
						value: `${client.game.currentTurn.user.username}`
					}]
				}
			})
		}
	},
	end: function (client, message, args) {
		client.game = false;
		return message.channel.send(`The game of UNO has been removed from existence!`);
	}
}