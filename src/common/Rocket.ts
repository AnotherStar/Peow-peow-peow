import { Body, PolygonShape, Vec2, World, XY } from '@flyover/box2d';
import { BodyUserData } from './plugin/UserData';
import { User } from './User';
import { between } from './utils';

export abstract class Rocket {
	body: Body;
	user: User;
	target: Body | null = null;

	constructor(world: World, user: User, position: XY, angle: number) {
		this.user = user;
		this.body = this.getBody(world, position, angle);
	}

	abstract getBody(world: World, position: XY, angle: number): Body;
}

export class RocketAlpha extends Rocket {
	getBody(world: World, position: XY, angle: number): Body {
		if (world.IsLocked()) throw 'world is locked';

		const body = world.CreateBody({
			type: 2,
			position: new Vec2(position.x, position.y),
			angle,
			linearDamping: 0.005,
			angularDamping: 0.05,
			allowSleep: false,
			bullet: true,
		});

		body.SetUserData({
			health: {
				current: 10,
				max: 10,
			},
			motor: {
				power: 0.01,
				getControl: () => this.getControl().y,
			},
			rubber: {
				power: 0.002,
				getControl: () => this.getControl().x,
			},
			// sideFriction: 0.001,
			color: this.user?.color | 0xfff000,
			lifetime: 10000,
		} as BodyUserData);

		const shape = new PolygonShape();

		shape.Set([
			//
			new Vec2(-0.1, 0),
			new Vec2(-0.1, 1),
			new Vec2(-0.0, 1.1),
			new Vec2(0.1, 1),
			new Vec2(0.1, 0),
		]);

		body.CreateFixture({
			shape,
			density: 0.7,
			restitution: 0.7,
			friction: 0.7,
		});

		setTimeout(() => {
			body.GetUserData().damage = 100;
		}, 100);

		return body;
	}

	getControl() {
		const userData = this.body.GetUserData();
		if (!userData.lifetime) {
			return {
				x: 0,
				y: 0,
			};
		}

		if (!this.target) this.target = this.findTarget();
		if (this.target && this.target.GetUserData().lifetime === 0) this.target = null;

		if (!this.target) {
			return {
				x: 0,
				y: 0.25,
			};
		}

		const deltaAngle = this.body.getAngleToBody(this.target);

		const controls = {
			x: deltaAngle > 0.01 ? 1 : deltaAngle < -0.01 ? -1 : 0,
			y: between(10000, 0, userData.lifetime, 0.75, 1, true),
		};

		if (userData.lifetime > 9900) controls.x = 0;
		if (userData.lifetime > 9500) controls.y = 0;

		return controls;
	}

	findTarget(): Body | null {
		const targets = this.body
			.GetWorld()
			.mapBody(body => {
				if (body.GetUserData().user === this.user || body.GetUserData()._id === this.body.GetUserData()._id)
					return {
						body,
						deltaAngle: 0,
						distance: 0,
						mass: 0,
					};
				const deltaAngle = this.body.getAngleToBody(body);
				const distance = this.body.getDistanceToBody(body);
				const mass = this.body.GetMass();
				return {
					body,
					deltaAngle,
					distance,
					mass,
				};
			})
			.filter(x => x.distance);

		targets.sort((a, b) => a.mass - b.mass);

		if (!targets.length) return null;

		return targets[0].body;
	}
}
