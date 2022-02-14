import { Body, Fixture, World } from '@flyover/box2d';

declare module '@flyover/box2d' {
	interface World {
		mapBody<T>(this: World, callback: MapBodyCallback<T>): T[];
		forEachBody(this: World, callback: ForEachBodyCallback): void;
	}
	interface Body {
		mapFixture<T>(this: Body, callback: MapFixtureCallback<T>): T[];
		forEachFixture(this: Body, callback: ForEachFixtureCallback): void;
		getAngleToBody(this: Body, target: Body): number;
		getDistanceToBody(this: Body, target: Body): number;
		Destroy(this: Body): void;
	}
}

type ForEachBodyCallback = (body: Body, index?: number) => void;
World.prototype.forEachBody = function (this: World, callback: ForEachBodyCallback) {
	let index = 0;
	let body = this.GetBodyList();
	while (body) {
		callback(body, index);
		body = body.GetNext();
		index++;
	}
};

type MapBodyCallback<T> = (body: Body, index?: number) => T;
World.prototype.mapBody = function <T>(this: World, callback: MapBodyCallback<T>): T[] {
	let array: T[] = [];
	let index = 0;
	let body = this.GetBodyList();
	while (body) {
		array.push(callback(body, index));
		body = body.GetNext();
		index++;
	}
	return array;
};

type ForEachFixtureCallback = (fixture: Fixture, index?: number) => void;
Body.prototype.forEachFixture = function (this: Body, callback: ForEachFixtureCallback) {
	let index = 0;
	let fixture = this.GetFixtureList();
	while (fixture) {
		callback(fixture, index);
		fixture = fixture.GetNext();
		index++;
	}
};

type MapFixtureCallback<T> = (fixture: Fixture, index?: number) => T;
Body.prototype.mapFixture = function <T>(this: Body, callback: MapFixtureCallback<T>): T[] {
	let array: T[] = [];
	let index = 0;
	let fixture = this.GetFixtureList();
	while (fixture) {
		array.push(callback(fixture, index));
		fixture = fixture.GetNext();
		index++;
	}
	return array;
};

Body.prototype.getAngleToBody = function (this: Body, target: Body): number {
	let targetAngle =
		Math.atan2(this.GetPosition().y - target.GetPosition().y, this.GetPosition().x - target.GetPosition().x) +
		Math.PI / 2;

	if (targetAngle < -Math.PI) targetAngle += 2 * Math.PI;
	if (targetAngle > Math.PI) targetAngle -= 2 * Math.PI;

	let deltaAngle = targetAngle - this.GetAngle();

	while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
	while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;

	return deltaAngle;
};

Body.prototype.getDistanceToBody = function (this: Body, target: Body): number {
	return Math.sqrt(
		Math.pow(this.GetPosition().x - target.GetPosition().x, 2) +
			Math.pow(this.GetPosition().y - target.GetPosition().y, 2),
	);
};

Body.prototype.Destroy = function (this: Body): void {
	const userData = this.GetUserData();
	const emitter = userData.motor?.emitter;
	if (emitter) {
		emitter.frequency = 0;
		setTimeout(() => {
			emitter.destroy();
		}, 1000);
	}
	setTimeout(() => {
		userData.lifetime = 0;
	}, 1000);
};
