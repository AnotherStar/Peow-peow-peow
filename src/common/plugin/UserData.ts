import { Body, CircleShape, Fixture, Vec2 } from '@flyover/box2d';
import { Emitter } from '@pixi/particle-emitter';
import { Rocket } from '../Rocket';
import { User } from '../User';

declare module '@flyover/box2d' {
	interface Body {
		GetUserData(): BodyUserData;
		SetUserData(data: BodyUserData): void;
	}
	interface Fixture {
		GetUserData(): FixtureUserData;
		SetUserData(data: FixtureUserData): void;
	}
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        BODY                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface BodyUserData {
	_id: string;
	_altitude: number;
	color: number;
	user?: User;
	motor?: {
		power: number;
		getControl: () => number;
		emitter?: Emitter;
	};
	rubber?: {
		power: number;
		getControl: () => number;
	};
	lifetime?: number;
	health?: {
		current: number;
		max: number;
	};
	launcher: {
		constructor: any;
		getControl: () => number;
		reloadingTime: number;
		reloadingTimeMax: number;
	};
	sideFriction?: number;
	damage?: number;
}

Body.prototype.GetUserData = function (this: Body): BodyUserData {
	if (!this.m_userData) this.m_userData = {} as BodyUserData;
	if (!this.m_userData._id) {
		this.m_userData._id = Math.random().toString(16).slice(2, 7);
		this.m_userData._altitude = 0;
	}
	return this.m_userData;
};

Body.prototype.SetUserData = function (this: Body, data: Partial<BodyUserData>) {
	this.m_userData = data;
};

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       FIXTURE                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

interface FixtureUserData {
	_id: string;
}

Fixture.prototype.GetUserData = function (this: Fixture): FixtureUserData {
	if (!this.m_userData) this.m_userData = {} as FixtureUserData;
	if (!this.m_userData._id) this.m_userData._id = Math.random().toString(16).slice(2, 7);
	return this.m_userData;
};

Fixture.prototype.SetUserData = function (this: Fixture, data: FixtureUserData) {
	this.m_userData = data;
};
