import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Player extends Phaser.GameObjects.Sprite {
	body: Phaser.Physics.Arcade.Body;

	private currentScene: Phaser.Scene;
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private walkingSpeed: number;
	private diagonalWalkingSpeed: number;

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
		this.initInput();

		this.scene.add.existing(this);
		this.body.setSize(8, 12);
		this.body.setOffset(4, 5);
	}

	private initVariables(): void {
		this.walkingSpeed = 100;
		this.diagonalWalkingSpeed = this.walkingSpeed * 0.7071;
	}

	private initImage(): void {
		this.setOrigin(0.5, 0.5);
		this.currentScene.physics.world.enable(this);
	}

	private initInput(): void {
		this.cursors = this.scene.input.keyboard.createCursorKeys();
	}

	update(): void {
		this.handleInput();
	}

	private handleInput(): void {
		const right = this.cursors.right.isDown || this.scene.input.keyboard.addKey('D').isDown;
		const up = this.cursors.up.isDown || this.scene.input.keyboard.addKey('W').isDown;
		const left = this.cursors.left.isDown || this.scene.input.keyboard.addKey('A').isDown;
		const down = this.cursors.down.isDown || this.scene.input.keyboard.addKey('S').isDown;

		if (right && up) {
			this.body.setVelocityX(this.diagonalWalkingSpeed);
			this.body.setVelocityY(-this.diagonalWalkingSpeed);
		} else if (right && down) {
			this.body.setVelocityX(this.diagonalWalkingSpeed);
			this.body.setVelocityY(this.diagonalWalkingSpeed);
		} else if (right) {
			this.body.setVelocityX(this.walkingSpeed);
			this.body.setVelocityY(0);
		} else if (left && up) {
			this.body.setVelocityX(-this.diagonalWalkingSpeed);
			this.body.setVelocityY(-this.diagonalWalkingSpeed);
		} else if (left && down) {
			this.body.setVelocityX(-this.diagonalWalkingSpeed);
			this.body.setVelocityY(this.diagonalWalkingSpeed);
		} else if (left) {
			this.body.setVelocityX(-this.walkingSpeed);
			this.body.setVelocityY(0);
		} else if (up) {
			this.body.setVelocityX(0);
			this.body.setVelocityY(-this.walkingSpeed);
		} else if (down) {
			this.body.setVelocityX(0);
			this.body.setVelocityY(this.walkingSpeed);
		} else {
			this.body.setVelocityX(0);
			this.body.setVelocityY(0);
		}
	}
}
