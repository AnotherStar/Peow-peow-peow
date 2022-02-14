import { ContactListener, World, Body } from '@flyover/box2d';

declare module '@flyover/box2d' {
	interface World {
		AddContactsEvents(this: World): void;
	}
}

World.prototype.AddContactsEvents = function (this: World) {
	const contactListener = new ContactListener();
	contactListener.BeginContact = contact => {
		try {
			const bodyA = contact.GetFixtureA().GetBody();
			const bodyB = contact.GetFixtureB().GetBody();

			const userDataA = bodyA.GetUserData();
			const userDataB = bodyB.GetUserData();

			if (userDataA.damage && userDataB.health) {
				userDataB.health.current -= userDataA.damage;
				bodyA.Destroy();
				contact.SetEnabled(false);
			}
			if (userDataB.damage && userDataA.health) {
				userDataA.health.current -= userDataB.damage;
				bodyB.Destroy();
				contact.SetEnabled(false);
			}
		} catch (error) {
			console.error(error);
		}
	};
	this.SetContactListener(contactListener);
};
