import './plugin/Tools';
import './plugin/PixiRender';
import './plugin/UserData';
import './plugin/Update';
import './plugin/ContactEvents';

import { ParticleIndex, World, XY } from '@flyover/box2d';
import { ShipAlpha } from './Ship';
import { randomBetween } from './utils';
import { User } from './User';

export type GameOptions = Pick<Game, 'fps'>;

export class Game {
	world: World;
	users: User[] = [];
	fps: number = 50;
	timeFactor: number = 1;
	prevTimestamp: number = 0;

	constructor(options: GameOptions) {
		this.world = new World({
			x: 0,
			y: 0,
		});

		this.world.AddContactsEvents();
	}

	tick() {
		try {
			const nowTimestamp = Date.now();
			const deltaTimestamp = nowTimestamp - (this.prevTimestamp || Date.now());
			this.prevTimestamp = nowTimestamp;

			this.world.forEachBody(body => {
				body.update(this.timeFactor * deltaTimestamp);
			});
			this.world.Step(this.timeFactor * deltaTimestamp, 8, 3);
			this.world.Render(this.timeFactor * deltaTimestamp);
		} catch {}
	}

	addUser() {
		const user = new User(this, {
			name: randomBetween(0, 64).toString(2),
			color: 0xff0000,
		});

		this.users.push(user);

		return user;
	}

	addBot() {
		const user = new User(this, {
			name: `Bot_${randomBetween(0, 64).toString(2)}`,
			color: 0xffffff,
		});

		user.spawn();

		user.controller.primary = 1;

		this.users.push(user);
	}

	getSpawnPosition(user: User) {
		const position = {
			x: randomBetween(10, 50),
			y: randomBetween(10, 50),
		};

		const angle = randomBetween(0, 2 * Math.PI);

		return {
			position,
			angle,
		};
	}

	// addShip() {
	// 	const position = {
	// 		x: randomBetween(10, 12),
	// 		y: randomBetween(10, 12),
	// 	};
	// 	const angle = randomBetween(0, 2 * Math.PI);
	// 	new ShipAlpha(this.world, position, angle);
	// }
}
