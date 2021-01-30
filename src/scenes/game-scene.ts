import { Sock } from '../objects/sock';
import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Throwable, ThrowableGroup } from '../objects/throwable';

export class GameScene extends Phaser.Scene {
	private playerStartingHP = 10;

	private map: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;
	private foregroundLayer: Phaser.Tilemaps.StaticTilemapLayer;

	private collectables: Array<Sock> = [];
	private throwables: ThrowableGroup;
	private player: Player;

	private enemyProjectiles: Phaser.GameObjects.Group;
	private enemies: Phaser.GameObjects.Group;

	private healths = new Map<Phaser.GameObjects.Sprite, number>();
	private hpText: Phaser.GameObjects.Text;

	private ammo: number;
	private ammoText: Phaser.GameObjects.Text;

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

		this.enemies = this.add.group();
		this.enemyProjectiles = this.add.group();

		this.createObjects();
		this.loadObjectsFromTilemap();
		this.createEvents();

		// set collision for tiles with the property collide set to true
		this.foregroundLayer.setCollisionByProperty({ collide: true });

		// Colliders
		this.physics.add.collider(this.player, this.foregroundLayer);
		this.physics.add.collider(this.throwables, this.foregroundLayer, (group: Throwable) => group.fall());

		// this.physics.add.overlap(
		// 	this.player,
		// 	this.enemyProjectiles,
		// 	this.handlePlayerCollisionWithProjectile,
		// 	null,
		// 	this
		// );

		this.physics.add.overlap(
			this.throwables,
			this.enemies,
			this.handleEnemyCollisionWithProjectile,
			null,
			this
		);

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

		this.hpText = this.add.text(2, 10, 'HP: ' + this.healths.get(this.player).toString(), {
			fontFamily: 'Arial',
			fontSize: 10,
			fill: '#ffffff'
		});
		this.hpText.scrollFactorX = 0;
		this.hpText.scrollFactorY = 0;
	}

	update(): void {
		// update player
		this.player.update();

		// pick up and update collectables
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

	private loadObjectsFromTilemap() {
		const objects = this.map.getObjectLayer('objects').objects as any[];

		objects.forEach((object) => {
			switch (object.type) {
				case "player" : {
					this.player = new Player({
						scene: this,
						x: object.x,
						y: object.y,
						texture: 'player'
					});
					this.healths.set(this.player, this.playerStartingHP);
					break;
				}
				case "sock" : {
					this.collectables.push(
						new Sock({
							scene: this,
							x: object.x,
							y: object.y,
							texture: 'sock'
						})
					);
					break;
				}
				case "enemy" : {
					var enemy = new Enemy({
						scene: this,
						x: object.x,
						y: object.y,
						texture: 'enemy'
					});
					this.enemies.add(enemy);
					this.healths.set(enemy, 3);
					break;
				}
			}
		})
	}

	private createObjects() {
		this.throwables = new ThrowableGroup(this);
	}

	private createEvents() {
		this.input.on('pointerdown', () => this.throwThrowable());
	}

	private handleEnemyCollisionWithProjectile(enemy: Enemy, proj: Throwable) {
		if (!proj.active) return;

		this.updateHealth(enemy, -1);
		proj.fall();
	}	

	// private handlePlayerCollisionWithProjectile(player: Player, enemyProj: EnemyProjectile) {
	// }

	private throwThrowable() {
		if (this.ammo > 0) {
			this.throwables.sendIt(this.player.x, this.player.y, this.player.angle);
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

	private updateHealth(obj: Phaser.GameObjects.Sprite, change: number) {
		var healths = this.healths;
		if (!healths.has(obj)) return;

		var newHP = healths.get(obj) + change;
		if (newHP <= 0) {
			newHP = 0;
			healths.delete(obj);
			obj.destroy();
		} else {
			healths.set(obj, newHP);
		}
	}

	private updateHealthHudText(): void {
		this.hpText.setText('HP: ' + this.healths.get(this.player).toString());
	}
}
