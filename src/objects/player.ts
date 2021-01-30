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
		if (this.cursors.right.isDown && this.cursors.up.isDown) {
			this.body.setVelocityX(this.diagonalWalkingSpeed);
			this.body.setVelocityY(-this.diagonalWalkingSpeed);
		} else if (this.cursors.right.isDown && this.cursors.down.isDown) {
			this.body.setVelocityX(this.diagonalWalkingSpeed);
			this.body.setVelocityY(this.diagonalWalkingSpeed);
		} else if (this.cursors.right.isDown) {
			this.body.setVelocityX(this.walkingSpeed);
			this.body.setVelocityY(0);
		} else if (this.cursors.left.isDown && this.cursors.up.isDown) {
			this.body.setVelocityX(-this.diagonalWalkingSpeed);
			this.body.setVelocityY(-this.diagonalWalkingSpeed);
		} else if (this.cursors.left.isDown && this.cursors.down.isDown) {
			this.body.setVelocityX(-this.diagonalWalkingSpeed);
			this.body.setVelocityY(this.diagonalWalkingSpeed);
		} else if (this.cursors.left.isDown) {
			this.body.setVelocityX(-this.walkingSpeed);
			this.body.setVelocityY(0);
		} else if (this.cursors.up.isDown) {
			this.body.setVelocityX(0);
			this.body.setVelocityY(-this.walkingSpeed);
		} else if (this.cursors.down.isDown) {
			this.body.setVelocityX(0);
			this.body.setVelocityY(this.walkingSpeed);
		} else {
			this.body.setVelocityX(0);
			this.body.setVelocityY(0);
		}

		if (Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y) > 1) {
			this.anims.play("PlayerWalk", true);
		} else {
			this.setFrame(0);
		}
	}
}
