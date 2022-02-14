import { Body, PolygonShape, Vec2, World, XY } from '@flyover/box2d';
import { BodyUserData } from './plugin/UserData';
import { RocketAlpha } from './Rocket';
import { User } from './User';

export abstract class Ship {
	body: Body;
	user: User;

	constructor(world: World, user: User, position: XY, angle: number) {
		this.user = user;
		this.body = this.getBody(world, position, angle);
	}

	abstract getBody(world: World, position: XY, angle: number): Body;
}

export class ShipAlpha extends Ship {
	getBody(world: World, position: XY, angle: number): Body {
		if (world.IsLocked()) throw 'world is locked';

		const body = world.CreateBody({
			type: 2,
			position: new Vec2(position.x, position.y),
			angle,
			linearDamping: 0.001,
			angularDamping: 0.02,
			allowSleep: false,
		});

		body.SetUserData({
			health: {
				current: 100,
				max: 100,
			},
			motor: {
				power: 0.1,
				getControl: () => this.user.controller.y,
			},
			rubber: {
				power: 0.05,
				getControl: () => this.user.controller.x,
			},
			launcher: {
				constructor: RocketAlpha,
				getControl: () => this.user.controller.primary,
				reloadingTime: 0,
				reloadingTimeMax: 10000,
			},
			user: this.user,
		} as BodyUserData);

		const shape = new PolygonShape();

		shape.Set([
			//
			new Vec2(-1, 0),
			new Vec2(0, 2.5),
			new Vec2(1, 0),
			new Vec2(0, -0.5),
		]);

		body.CreateFixture({
			shape,
			density: 0.7,
			restitution: 0.7,
			friction: 0.7,
		});

		return body;
	}
}
