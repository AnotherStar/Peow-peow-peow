import { Body, CircleShape, Vec2 } from '@flyover/box2d';
import { Rocket } from '../Rocket';

import { BodyUserData } from './UserData';

declare module '@flyover/box2d' {
	interface Body {
		update(this: Body, delta: number): void;
	}
}

Body.prototype.update = function (this: Body, delta: number) {
	const userData = this.GetUserData();

	if (userData.lifetime === 0 || (userData.health && userData.health.current === 0)) {
		return this.GetWorld().DestroyBody(this);
	}

	if (userData.motor) {
		const force = (delta / 1000) * userData.motor.getControl() * userData.motor.power;
		const bodyDirection = this.GetWorldVector(new Vec2(0, 1), new Vec2(0, 1));
		if (force) this.ApplyLinearImpulseToCenter(bodyDirection.SelfMul(force), true);
	}

	if (userData.rubber) {
		const force = (delta / 1000) * userData.rubber.getControl() * userData.rubber.power;
		if (force) this.ApplyAngularImpulse(force, true);
	}

	if (userData.lifetime) {
		userData.lifetime -= delta;
		if (userData.lifetime < 0) userData.lifetime = 0;
	}

	if (userData.launcher) {
		userData.launcher.reloadingTime = Math.max(0, userData.launcher.reloadingTime - delta);
		const user = userData.user;
		if (!user) throw '!user launcher';
		if (userData.launcher.getControl() && !userData.launcher.reloadingTime) {
			try {
				const bullet = new userData.launcher.constructor(
					this.GetWorld(),
					user,
					this.GetWorldPoint({ x: 0, y: 0 }, { x: 0, y: 0 }),
					this.GetAngle(),
				) as Rocket;

				const bodyVelocity = this.GetLinearVelocity();
				const bodyDirection = this.GetWorldVector(new Vec2(0, 1), new Vec2(0, 1)).SelfMul(0.75);

				bullet.body.SetLinearVelocity(bodyDirection.SelfAdd(bodyVelocity));
				userData.launcher.reloadingTime = userData.launcher.reloadingTimeMax;
			} catch (error) {
				console.error(error);
			}
		}
	}

	if (userData.sideFriction) {
		const m_currentTraction = 1;

		const currentLateralNormal = getLateralVelocity(this);
		const currentLateralSpeed = currentLateralNormal.Normalize();
		const dragForceMagnitude = -2 * currentLateralSpeed;
		this.ApplyForce(
			currentLateralNormal.SelfMul(userData.sideFriction * m_currentTraction * dragForceMagnitude),
			this.GetWorldCenter(),
		);
	}
};

const getLateralVelocity = function (body: Body): Vec2 {
	const currentRightNormal = body.GetWorldVector(new Vec2(1, 0), new Vec2());
	return currentRightNormal.SelfMul(Vec2.DotVV(currentRightNormal, body.GetLinearVelocity()));
};

const getForwardVelocity = function (body: Body): Vec2 {
	const currentLateralNormal = body.GetWorldVector(new Vec2(0, 1), new Vec2());
	return currentLateralNormal.SelfMul(Vec2.DotVV(currentLateralNormal, body.GetLinearVelocity()));
};
