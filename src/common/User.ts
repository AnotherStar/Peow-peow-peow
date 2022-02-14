import { Game } from './Game';
import { Ship, ShipAlpha } from './Ship';

export type UserOptions = Pick<User, 'name' | 'color'>;

export class User {
	game: Game;

	controller: {
		x: number;
		y: number;
		angle: number;
		primary: number;
	} = {
		x: 0,
		y: 0,
		angle: 0,
		primary: 0,
	};

	name: string;
	color: number;

	ship?: Ship;

	get isSpawned(): boolean {
		return !!this.ship;
	}

	spawn() {
		if (this.isSpawned) return;
		const { position, angle } = this.game.getSpawnPosition(this);
		this.ship = new ShipAlpha(this.game.world, this, position, angle);
		this.game.world;
	}

	constructor(game: Game, options: UserOptions) {
		this.game = game;
		this.name = options.name;
		this.color = options.color;
	}

	getInfo() {
		return {
			name: this.name,
			controller: this.controller,
			// speed: this.ship && this.ship.body.GetLinearVelocity(),
		};
	}
}
