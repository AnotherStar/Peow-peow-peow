import { World, Body, Fixture, Shape, CircleShape, PolygonShape, branch } from '@flyover/box2d';
import * as PIXI from 'pixi.js';
import { Emitter, Particle } from '@pixi/particle-emitter';
import { fireEmitter } from './particles';
import { between } from '../utils';

const LINE_WIDTH = 1.5;
const SCALE = 10;

declare module 'pixi.js' {
	interface DisplayObject {
		isUpdated: boolean;
	}
}

declare module '@flyover/box2d' {
	interface World {
		scale: number;
		lineWidth: number;
		pixi: PIXI.Application;
		render<T>(this: World): void;
		SetupRender(this: World, element: HTMLDivElement, options: PIXI.IApplicationOptions): void;
		Render(this: World, delta: number): void;
		RenderBody(this: World, body: Body, delta: number): void;
		RenderFixture(this: World, fixture: Fixture): void;
		RenderShape(this: World, shape: Shape): void;
	}
}

World.prototype.SetupRender = function (this: World, element: HTMLDivElement, options: PIXI.IApplicationOptions): void {
	this.pixi = new PIXI.Application({
		width: window.innerWidth,
		height: window.innerHeight,
		resolution: window.devicePixelRatio,
		autoDensity: true,
		// antialias: true,
		backgroundColor: 0x343a40,
		...options,
	});

	// this.pixi.loader

	//@ts-ignore
	window.pixi = this.pixi;

	element.appendChild(this.pixi.view);

	this.pixi.stage.setTransform(100, 100, 1, 1);
};

World.prototype.Render = function (this: World, delta: number): void {
	if (!this.pixi.stage) return;

	this.pixi.stage.children.forEach(x => (x.isUpdated = false));

	this.forEachBody(body => this.RenderBody(body, delta));

	this.pixi.stage.children
		// @ts-ignore
		.filter(x => !x.isUpdated)
		.forEach(child => {
			if (child instanceof Particle) return;
			if (child.isUpdated === false) this.pixi.stage.removeChild(child);
		});
};

World.prototype.RenderBody = function (this: World, body: Body, delta: number): void {
	const userData = body.GetUserData();

	if (!this.pixi.stage.getChildByName(userData._id)) {
		const newGraphics = drawBody(body);
		this.pixi.stage.addChild(newGraphics);
	}

	const graphics = this.pixi.stage.getChildByName(userData._id);

	graphics.x = body.GetPosition().x * SCALE;
	graphics.y = body.GetPosition().y * SCALE;
	graphics.rotation = body.GetAngle();

	graphics.isUpdated = true;

	if (userData.motor) {
		if (!userData.motor.emitter) {
			userData.motor.emitter = new Emitter(this.pixi.stage, fireEmitter);
			userData.motor.emitter.emit = true;
			console.log('new emitter', userData.motor.emitter);
		}

		userData.motor.emitter.updateOwnerPos(body.GetPosition().x * SCALE, body.GetPosition().y * SCALE);
		userData.motor.emitter.rotate(body.GetAngle());

		const behaivor = userData.motor.emitter.getBehavior('moveSpeedStatic');

		// if (behaivor) {
		// 	behaivor.min = 0;
		// 	behaivor.max = userData.motor.getControl() * 100;
		// }

		userData.motor.emitter.spawnChance = between(0, 1, userData.motor.getControl(), 0, 1);
		// userData.motor.emitter.frequency = between(0, 1, userData.motor.getControl(), 1, 1 / 500);

		// console.log(userData.motor.emitter.frequency);

		// between(0, userData.motor.getControl(), 1, 1 / 300, 1 / 1000);
		// console.log());

		userData.motor.emitter.update(delta / 1000);
	}
};

const drawBody = (body: Body) => {
	const userData = body.GetUserData();

	const graphics = new PIXI.Graphics();
	graphics.filters = [];

	body.forEachFixture(fixture => {
		const shape = fixture.GetShape();
		if (isPolygonShape(shape)) {
			const lastPoint = shape.m_vertices[shape.m_vertices.length - 1];
			if (!lastPoint) throw '!lastPoint';
			graphics.lineStyle({
				width: LINE_WIDTH,
				color: userData.color || 0xffffff,
			});
			graphics.moveTo(lastPoint.x * SCALE, lastPoint.y * SCALE);
			shape.m_vertices.forEach(verticle => {
				graphics.lineTo(verticle.x * SCALE, verticle.y * SCALE);
			});
		} else if (isCircleShape(shape)) {
			graphics.lineStyle({
				width: LINE_WIDTH,
				color: 0xffffff,
			});
			graphics.arc(shape.m_p.x * SCALE, shape.m_p.y * SCALE, shape.m_radius * SCALE, 0, Math.PI * 2);
		}
	});
	graphics.endFill();

	graphics.name = userData._id;

	return graphics;
};

World.prototype.RenderFixture = function (this: World, fixture: Fixture): void {};

function isCircleShape(shape: Shape): shape is CircleShape {
	return shape.GetType() === 0;
}

function isPolygonShape(shape: Shape): shape is PolygonShape {
	return shape.GetType() === 2;
}
