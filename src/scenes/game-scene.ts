import { Sock } from '../objects/sock';
import { Player } from '../objects/player';
import { EnemyProjectile, Projectile, ProjectileGroup } from '../objects/projectile';
import { Enemy } from '../objects/enemy';

export class GameScene extends Phaser.Scene {
	// tilemap
	private map: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;
	private foregroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
	private collectables: Array<Sock>;
	private playerProjectiles: ProjectileGroup;
	private enemyProjectiles: ProjectileGroup;
	private ammoText: Phaser.GameObjects.Text;
	private ammo: number;
	private player: Player;
	private enemy: Enemy;

	public lastSockWasFlipped = false;

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

		this.createObjects();
		this.createEvents();

		// set collision for tiles with the property collide set to true
		this.foregroundLayer.setCollisionByProperty({ collide: true });

		// Colliders
		this.physics.add.collider(this.player, this.foregroundLayer);
		this.physics.add.collider(this.playerProjectiles, this.foregroundLayer, (projectile: Projectile) => projectile.fall());
		this.physics.add.collider(this.playerProjectiles, this.enemy, (enemy: Enemy, projectile: Projectile) => {
			projectile.fall();
			enemy.knockout();
		});

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

		// set default cursor
		this.input.setDefaultCursor('url(assets/images/crosshair.png), pointer')
	}

	update(): void {
		// update player
		this.player.update();

		// pick up collectables
		this.collectables = this.collectables.filter(c => {
			c.update();
			if (
				Phaser.Geom.Intersects.RectangleToRectangle(
					this.player.getBounds(),
					c.getBounds()
				)
			) {
				c.destroy();
				this.updateAmmoStatus(1);
				return false;
			} else {
				return true;
			}
		});
	}

	private createObjects() {
		this.playerProjectiles = new ProjectileGroup(this, Projectile);
		this.enemyProjectiles = new ProjectileGroup(this, EnemyProjectile);
		this.collectables = this.createSocks(60);
		this.player = new Player({
			scene: this,
			x: this.sys.canvas.width / 2,
			y: this.sys.canvas.height / 2,
			texture: 'player'
		});
		this.enemy = new Enemy({
			scene: this,
			x: this.player.x + 150,
			y: this.player.y + 120,
			texture: 'player'
		});
	}

	private createEvents() {
		this.input.on('pointerdown', () => this.throwThrowable());
	}

	private throwThrowable() {
		if (this.ammo > 0) {
			this.playerProjectiles.sendIt(this.player.x, this.player.y);
			this.updateAmmoStatus(1, false);
		}
	}

	private updateAmmoStatus(amount: number, increase: boolean = true): void {
		if (increase) {
			this.ammo++;
		} else {
			this.ammo--;
		}
		this.ammoText.setText('Ammo: ' + this.ammo.toString());
	}

	private createSocks(howMany: number) {
		const socks = [];
		for (let i = 0; i < howMany; i++) {
			socks.push(
				new Sock({
					scene: this,
					x: Phaser.Math.RND.integerInRange(100, this.map.widthInPixels - 100),
					y: Phaser.Math.RND.integerInRange(100, this.map.heightInPixels - 100),
					texture: 'sock'
				})
			);
		}
		return socks;
	}
}
