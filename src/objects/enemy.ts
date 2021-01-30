import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Enemy extends Phaser.GameObjects.Sprite {
	body: Phaser.Physics.Arcade.Body;

	private currentScene: Phaser.Scene;
	private walkingSpeed: number;
	private xyDirection: { x: number, y: number };

	constructor(aParams: ISpriteConstructor) {
		super(
			aParams.scene,
			aParams.x,
			aParams.y,
			aParams.texture,
			aParams.frame
		);

		this.initVariables();
		this.currentScene = aParams.scene;
		this.initImage();

		this.scene.add.existing(this);
		this.body.setSize(8, 12);
		this.body.setOffset(4, 5);
		this.updateVelocity();
	}

	private initVariables(): void {
		this.walkingSpeed = 40;

		this.xyDirection = {
			x: Phaser.Math.Between(-1, 1),
			y: Phaser.Math.Between(-1, 1)
		}
	}

	private initImage(): void {
		this.setOrigin(0, 0);
		this.anims.play("enemyWalk", true);
		this.currentScene.physics.world.enable(this);
	}

	update(lookX: number): void {
		if (lookX < this.x) {
			this.setFlip(true, false);
		} else {
			this.setFlip(false, false);
		}
	}

	private updateVelocity(): void {
		this.xyDirection = {
			x: this.xyDirection.x * -1,
			y: this.xyDirection.y * -1
		}
		if (this.body) {
			this.body.setVelocityX(this.xyDirection.x * this.walkingSpeed);
			this.body.setVelocityY(this.xyDirection.y * this.walkingSpeed);
			setTimeout(() => this.updateVelocity(), 900);
		}
	}

	knockout() {
        this.destroy();
    }
}