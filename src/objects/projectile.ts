
export class ProjectileGroup extends Phaser.Physics.Arcade.Group {
	constructor(scene: Phaser.Scene, type: Function) {
		// Call the super constructor, passing in a world and a scene
		super(scene.physics.world, scene);

		// Initialize the group
		this.createMultiple({
			classType: type, // This is the class we create just below
			frameQuantity: 30, // Create 30 instances in the pool
			active: false,
			visible: false,
            key: 'projectiles'
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

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    body: Phaser.Physics.Arcade.Body;
    private velocity: number = 240;
    private fallTime: number = 420; //ms

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'playerProjectile');

        this.anims.play('playerProjectile', true);
    }

	sendIt(x: number, y: number) {
        this.body.reset(x, y);
        this.setScale(0.75, 0.75);

		this.setActive(true);
        this.setVisible(true);

        setTimeout(() => this.fall(), this.fallTime);

        const cursor = this.getCursorPosition();

        this.scene.physics.moveTo(this, cursor.x, cursor.y, this.velocity);
    }
    
    fall() {
        this.body.reset(0, 0);
        this.setVelocity(0);
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

export class EnemyProjectile extends Phaser.Physics.Arcade.Sprite {
    body: Phaser.Physics.Arcade.Body;
    private velocity: number = 240;
    private fallTime: number = 420; //ms

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'npcProjectile');

        this.anims.play('npcProjectile', true);
    }

	sendIt(x: number, y: number, player: Phaser.GameObjects.GameObject) {
        this.body.reset(x, y);
        this.setScale(0.75, 0.75);

		this.setActive(true);
        this.setVisible(true);

        setTimeout(() => this.fall(), this.fallTime);

        this.scene.physics.moveTo(this, player.body.position.x, player.body.position.y, this.velocity);
    }
    
    fall() {
        this.body.reset(0, 0);
        this.setVelocity(0);
        this.setActive(false);
		this.setVisible(false);
    }
}
