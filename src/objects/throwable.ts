export class ThrowableGroup extends Phaser.Physics.Arcade.Group {
	constructor(scene: Phaser.Scene) {
		// Call the super constructor, passing in a world and a scene
		super(scene.physics.world, scene);

		// Initialize the group
		this.createMultiple({
			classType: Throwable, // This is the class we create just below
			frameQuantity: 30, // Create 30 instances in the pool
			active: false,
			visible: false,
			key: 'throwable'
		});
	}

	sendIt(x: number, y: number) {
		// Get the first available sprite in the group
		const throwable = this.getFirstDead(false);
		if (throwable) {
			throwable.sendIt(x, y);
		}
	}
}

export class Throwable extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'throwable');

		scene.add.image(x, y, 'throwable');
	}

	sendIt(x: number, y: number) {
		this.body.reset(x, y);

		this.setActive(true);
		this.setVisible(true);

		this.setVelocityY(10);
	}
}
