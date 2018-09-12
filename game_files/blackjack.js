const Game = require('./game.js');

class Blackjack extends Game.game {
	constructor(){
		super("blackjack");
		this.deck = [];
		this.createDeck();
	}
	
	start() {
		return message.channel.send("A game of BlackJack is starting!")
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
		let suits = ["Spades", "Hearts", "Clubs", "Diamonds"];
		let ranks = ["Ace", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
		
		let deck = suits.map(i => {
			let suitrank = [];
			for (let k in ranks) {
				suitrank.push({ suit: i, rank: ranks[k] });
			}
			return suitrank;
		})
		
		this.deck = this.shuffle(deck));
		
		return this.deck;
	}
	
	dealHand(handSize) {
		let hand = this.deck.splice(0, handSize);
		
		return hand;
	}
	
	handValue(hand) {
		if (hand.length === 2) {
			var Aces = 0;
			var Picts = 0;
			for (var k = 0; k < hand.length; k++) {
				if (hand[k].rank === "Ace") {
					Aces += 1;
				} else if (hand[k].rank in {"Jack": 1, "Queen": 1, "King": 1} || hand[k].rank === 10) {
					Picts += 1;
				}
			}
			if (Aces == 1 && Picts == 1) {
				return "Blackjack! (21 in 2 cards with an Ace)"
			}
			if (Aces == 2) {
				return "Blackjack - Double Aces! (21 with a 2 card hand of 2 Aces)"
			}
		}
		var value = 0;
		var AS = 0;
		for (var i = 0; i < hand.length; i++) {
			if (typeof hand[i].rank === "number") {
				value += hand[i].rank;
			} else if (hand[i].rank in {"Jack": 1, "Queen": 1, "King": 1}) {
				value += 10;
			} else if (hand[i].rank === "Ace") {
				value += 1;
				AS++;
			}
		}
		for (var j = 0; j < AS; j++) {
			if ((value + 10) <= 21) value += 10;
		}
		return value;
	}
}

module.exports = {
	blackjack: Blackjack
}