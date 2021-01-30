import { AnimationHelper } from '../helpers/animation-helper';

export class StartScene extends Phaser.Scene {

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

		this.playMusic();

		// press any key to start
		this.input.keyboard.on('keydown', () => this.startScene());
	}

	preload(): void {
		this.cameras.main.setBackgroundColor(0x000000);
		this.load.audio('main theme', 'assets/audio/Sneakerheads_MT.mp3');
		this.load.audio('start game', 'assets/audio/start_game.mp3');
	}

	update(): void { }

	private playMusic() {
		const music = this.sound.add('main theme');
		music.play({ loop: true });
	}

	private startScene() {
		const soundEffect = this.sound.add('start game');
		soundEffect.play();
		this.scene.start('BootScene');
	}
}
