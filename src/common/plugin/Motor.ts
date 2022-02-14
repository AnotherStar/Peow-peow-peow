import { Body, Fixture, World } from '@flyover/box2d';

declare module '@flyover/box2d' {
	interface Body {
		SetAsMotor(
			this: Body,
			options: {
				power: number;
			},
		): void;
	}
}

Body.prototype.SetAsMotor = function (
	this: Body,
	options: {
		power: number;
	},
) {
	const userData = this.GetUserData();
	userData.motor = {
		power: options.power,
	};
	userData.emitters.push();
};
