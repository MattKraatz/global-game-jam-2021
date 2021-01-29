import { Sock } from '../objects/sock';
import { Player } from '../objects/player';
import { ThrowableGroup } from '../objects/throwable';

export class GameScene extends Phaser.Scene {
	// tilemap
	private map: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;
	private foregroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
	private collectables: Array<Sock>;
	private throwables: ThrowableGroup;
	private ammoText: Phaser.GameObjects.Text;
	private ammo: number;
	private player: Player;

	constructor() {
		super({
			key: 'GameScene'
		});
	}

	init(): void {
		this.registry.set('level', 'city');
		this.ammo = 0;
	}

	create(): void {
		// create our tilemap from Tiled JSON
		this.map = this.make.tilemap({ key: 'city' });
		// add our tileset and layers to our tilemap
		this.tileset = this.map.addTilesetImage('sneakerhead tileset');
		this.foregroundLayer = this.map.createStaticLayer(
			'Tile Layer 1',
			this.tileset,
			0,
			0
		);
		this.foregroundLayer.setName('Tile Layer 1');

		// set collision for tiles with the property collide set to true
		this.foregroundLayer.setCollisionByProperty({ collide: true });

		// Colliders
		this.physics.add.collider(this.player, this.foregroundLayer);

		// Camera
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.map.heightInPixels
		);
		this.cameras.roundPixels = true;

		// create texts
		this.ammoText = this.add.text(2, 2, 'Ammo: ' + this.ammo.toString(), {
			fontFamily: 'Arial',
			fontSize: 10,
			fill: '#ffffff'
		});
		this.ammoText.scrollFactorX = 0;
		this.ammoText.scrollFactorY = 0;
	}

	update(): void {
		// update player
		this.player.update();

		// pick up collectables
		this.collectables = this.collectables.filter(c => {
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

	private throwThrowable(event: any) {
		this.throwables.sendIt(this.player.x, this.player.y);
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
