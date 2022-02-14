import { Fixture, FixtureDef, PolygonShape } from '@flyover/box2d';

class ShipBuilder {}

abstract class Module {
	abstract getFixture(): FixtureDef;
}

abstract class Engine extends Module {}

export class SimpleEngine extends Engine {
	getFixture(): FixtureDef {
		const shape = new PolygonShape();
		shape.SetAsBox(1, 0.4);
		const fixture = new FixtureDef();
		fixture.density = 1;
		fixture.restitution = 1;
		fixture.friction = 1;
		fixture.shape = shape;
		return fixture;
	}
}
