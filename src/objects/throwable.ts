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

	sendIt(x: number, y: number, angle: number) {
		// Get the first available sprite in the group
		const throwable = this.getFirstDead(false);
		if (throwable) {
			throwable.sendIt(x, y, angle);
		}
	}
}

export class Throwable extends Phaser.Physics.Arcade.Sprite {
	body: Phaser.Physics.Arcade.Body;

    private velocity: number = 240;
    private fallTime: number = 420; //ms

	constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'throwable');

        this.scene.add.existing(this);
    }

	sendIt(x: number, y: number, angle: number) {
		this.body.reset(x, y);
        this.setAngularVelocity(240);

		this.setActive(true);
        this.setVisible(true);

        // The timeout was seemingly the cause of a bug that prevented
        // collision with enemies from being detected sometimes. We should
        // probably just let projectiles go until they exit the map.
        // setTimeout(() => this.fall(), thisa.fallTime);

        const cursor = this.getCursorPosition();
        this.scene.physics.moveTo(this, cursor.x, cursor.y, this.velocity);
    }
    
    fall() {
    	// Setting the angular velocity to 0 wasn't seeming to stop it for some
    	// reason.
		this.body.setVelocityX(0);
		this.body.setVelocityY(0);

		// see ya later
		this.x = -1000;
		this.y = -1000;

        this.setActive(false);
		this.setVisible(false);
    }

    private getCursorPosition() {
        return {
            x: this.scene.cameras.main.scrollX + this.scene.input.activePointer.x,
            y: this.scene.cameras.main.scrollY + this.scene.input.activePointer.y
        }
    }
}
