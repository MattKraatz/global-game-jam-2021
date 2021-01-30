import { AnimationHelper } from '../helpers/animation-helper';

export class StartScene extends Phaser.Scene {
	// helpers

	constructor() {
		super({
			key: 'StartScene'
		});
	}

	create(): void {
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
		this.add.text(screenCenterX, screenCenterY - 20, 'SNEAKERHEADS', { fontSize: '32px' }).setOrigin(0.5);
		this.add.text(screenCenterX, screenCenterY + 10, 'Press any key to start').setOrigin(0.5);

		// press any key to start
		this.input.keyboard.on('keydown', () => this.scene.start('BootScene'));
	}

	preload(): void {
		this.cameras.main.setBackgroundColor(0x000000);
	}

	update(): void { }

}
