class Game {
	constructor(game){
		this.game = game;
	}
	
	canAddPlayer(player) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].tag === player.user.tag) {
				return false;
			}
		}

		return true;
	}
}

class Player extends Game {
	constructor(user, game){
		super(game);
		this.user = user;
	}
}

module.exports = {
	game: Game,
	player: Player
}