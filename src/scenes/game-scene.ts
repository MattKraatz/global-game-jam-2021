import { Sock } from '../objects/sock';
import { Player } from '../objects/player';

export class GameScene extends Phaser.Scene {
	private background: Phaser.GameObjects.Image;
	private socks: Array<Sock>;
	private ammoText: Phaser.GameObjects.Text;
	private ammo: number;
	private player: Player;

	constructor() {
		super({
			key: 'GameScene'
		});
	}

	preload(): void {
		this.load.image('background', './assets/images/background.png');
		this.load.image('player', './assets/images/player.png');
		this.load.image('sock', './assets/images/sock.png');
	}

	init(): void {
		this.ammo = 0;
	}

	create(): void {
		// create background
		this.background = this.add.image(0, 0, 'background');
		this.background.setOrigin(0, 0);

		// create objects
		this.socks = this.createSocks(12);
		this.player = new Player({
			scene: this,
			x: this.sys.canvas.width / 2,
			y: this.sys.canvas.height / 2,
			texture: 'player'
		});

		// create texts
		this.ammoText = this.add.text(
			this.sys.canvas.width / 2 - 50,
			this.sys.canvas.height - 50,
			'Ammo: ' + this.ammo.toString(),
			{
				fontFamily: 'Arial',
				fontSize: 38,
				stroke: '#fff',
				strokeThickness: 6,
				fill: '#000000'
			}
		);
	}

	update(): void {
		// update objects
		this.player.update();
		this.socks = this.socks.filter(c => {
			if (
				Phaser.Geom.Intersects.RectangleToRectangle(
					this.player.getBounds(),
					c.getBounds()
				)
			) {
				c.destroy();
				this.updateCoinStatus();
				return false;
			} else {
				return true;
			}
		});
	}

	private updateCoinStatus(): void {
		this.ammo++;
		this.ammoText.setText('Ammo: ' + this.ammo.toString());
	}

	private createSocks(howMany: number) {
		const socks = [];
		for (let i = 0; i < howMany; i++) {
			socks.push(
				new Sock({
					scene: this,
					x: Phaser.Math.RND.integerInRange(100, 700),
					y: Phaser.Math.RND.integerInRange(100, 500),
					texture: 'sock'
				})
			);
		}
		return socks;
	}
}
