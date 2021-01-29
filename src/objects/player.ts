import { IImageConstructor } from '../interfaces/image.interface';

export class Player extends Phaser.GameObjects.Image {
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private walkingSpeed: number;
	private diagonalWalkingSpeed: number;

	constructor(aParams: IImageConstructor) {
		super(aParams.scene, aParams.x, aParams.y, aParams.texture);

		this.initVariables();
		this.initImage();
		this.initInput();

		this.scene.add.existing(this);
	}

	private initVariables(): void {
		this.walkingSpeed = 5;
		this.diagonalWalkingSpeed = 4;
	}

	private initImage(): void {
		this.setOrigin(0.5, 0.5);
	}

	private initInput(): void {
		this.cursors = this.scene.input.keyboard.createCursorKeys();
	}

	update(): void {
		this.handleInput();
	}

	private handleInput(): void {
		this.handleWalking();
	}

	private handleWalking() {
		if (this.cursors.right.isDown && this.cursors.up.isDown) {
			this.x += this.diagonalWalkingSpeed;
			this.y -= this.diagonalWalkingSpeed;
			this.setAngle(315);
		} else if (this.cursors.right.isDown && this.cursors.down.isDown) {
			this.x += this.diagonalWalkingSpeed;
			this.y += this.diagonalWalkingSpeed;
			this.setAngle(45);
		} else if (this.cursors.right.isDown) {
			this.x += this.walkingSpeed;
			this.setAngle(0);
		} else if (this.cursors.left.isDown && this.cursors.up.isDown) {
			this.x -= this.diagonalWalkingSpeed;
			this.y -= this.diagonalWalkingSpeed;
			this.setAngle(225);
		} else if (this.cursors.left.isDown && this.cursors.down.isDown) {
			this.x -= this.diagonalWalkingSpeed;
			this.y += this.diagonalWalkingSpeed;
			this.setAngle(135);
		} else if (this.cursors.left.isDown) {
			this.x -= this.walkingSpeed;
			this.setAngle(180);
		} else if (this.cursors.up.isDown) {
			this.y -= this.walkingSpeed;
			this.setAngle(270);
		} else if (this.cursors.down.isDown) {
			this.y += this.walkingSpeed;
			this.setAngle(90);
		}
	}
}
