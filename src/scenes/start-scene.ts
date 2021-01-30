import { AnimationHelper } from '../helpers/animation-helper';

export class StartScene extends Phaser.Scene {
	// helpers

	constructor() {
		super({
			key: 'StartScene'
		});
		
		// press any key to start
		this.input.keyboard.on('keydown', () => this.scene.start('BootScene'));
	}

	preload(): void {
		this.cameras.main.setBackgroundColor(0x000000);
	}

	update(): void { }

}
