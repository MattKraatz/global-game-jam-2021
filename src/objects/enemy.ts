import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Enemy extends Phaser.GameObjects.Sprite {
	body: Phaser.Physics.Arcade.Body;

	private currentScene: Phaser.Scene;

	constructor(aParams: ISpriteConstructor) {
		super(
			aParams.scene,
			aParams.x,
			aParams.y,
			aParams.texture,
			aParams.frame
		);

		this.currentScene = aParams.scene;
		this.initImage();

		this.scene.add.existing(this);
		this.body.setSize(8, 12);
		this.body.setOffset(4, 5);
	}

	private initImage(): void {
		this.setOrigin(0, 0);
		this.currentScene.physics.world.enable(this);
		this.anims.play("enemyWalk", true);
	}
}