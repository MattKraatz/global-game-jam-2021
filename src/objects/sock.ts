import { IImageConstructor } from '../interfaces/image.interface';

export class Sock extends Phaser.GameObjects.Image {
	constructor(aParams: IImageConstructor) {
		super(aParams.scene, aParams.x, aParams.y, aParams.texture);

		this.initVariables();
		this.initImage();
		this.initEvents();

		this.scene.add.existing(this);
	}

	private initVariables(): void {}

	private initImage(): void {
		this.setOrigin(0.5, 0.5);
	}

	private initEvents(): void {}

	update(): void {}
}
