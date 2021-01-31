import { Sock } from '../objects/sock';
import { Player } from '../objects/player';
import { Enemy, EnemyGroup } from '../objects/enemy';
import { EnemyProjectile, Projectile, ProjectileGroup } from '../objects/projectile';

export class GameScene extends Phaser.Scene {
	private playerStartingHP = 10;

	private map: Phaser.Tilemaps.Tilemap;
	private tileset: Phaser.Tilemaps.Tileset;

	private foregroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
	private foregroundLayerAbove: Phaser.Tilemaps.StaticTilemapLayer;
	private noBulletColLayer: Phaser.Tilemaps.StaticTilemapLayer;
	private noBulletColLayerAbove: Phaser.Tilemaps.StaticTilemapLayer;
	private topLayer: Phaser.Tilemaps.StaticTilemapLayer;

	private collectables: Array<Sock> = [];
	private playerProjectiles: ProjectileGroup;
	private player: Player;

	private enemyProjectiles: ProjectileGroup;
	private enemyGroup: EnemyGroup;

	private healths = new Map<Phaser.GameObjects.Sprite, number>();
	private hpText: Phaser.GameObjects.Text;

	private ammo: number;
	private ammoText: Phaser.GameObjects.Text;

	private levelMusic: Phaser.Sound.BaseSound;
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


		this.foregroundLayerAbove = this.map.createStaticLayer(
			'above bottom',
			this.tileset,
			0,
			0
		);
		this.foregroundLayerAbove.setName('above bottom');

		this.noBulletColLayer = this.map.createStaticLayer(
			'no bullet col',
			this.tileset,
			0,
			0
		);
		this.noBulletColLayer.setName('no bullet col');

		this.noBulletColLayerAbove = this.map.createStaticLayer(
			'no bullet col 2',
			this.tileset,
			0,
			0
		);
		this.noBulletColLayerAbove.setName('no bullet col 2');

		this.topLayer = this.map.createStaticLayer(
			'top',
			this.tileset,
			0,
			0
		);
		this.topLayer.setName('top');

		this.createObjects();
		this.createEvents();

		// set collision for tiles with the property collide set to true
		this.foregroundLayer.setCollisionByProperty({ collide: true });
		this.foregroundLayerAbove.setCollisionByProperty({ collide: true });
		this.noBulletColLayer.setCollisionByProperty({ collide: true });
		this.noBulletColLayerAbove.setCollisionByProperty({ collide: true });

		// Colliders
		this.physics.add.collider(this.player, this.foregroundLayer);
		this.physics.add.collider(this.player, this.foregroundLayerAbove);
		this.physics.add.collider(this.player, this.noBulletColLayer);
		this.physics.add.collider(this.player, this.noBulletColLayerAbove);
		
		this.physics.add.collider(this.playerProjectiles, this.foregroundLayer, (projectile: Projectile) => projectile.fall());
		this.physics.add.collider(this.playerProjectiles, this.foregroundLayerAbove, (projectile: Projectile) => projectile.fall());
    
		this.physics.add.collider(this.enemyProjectiles, this.foregroundLayer, (projectile: Projectile) => projectile.fall());
    	this.physics.add.collider(this.enemyProjectiles, this.foregroundLayerAbove, (projectile: Projectile) => projectile.fall());


		this.physics.add.overlap(
			this.playerProjectiles,
			this.enemyGroup,
			this.handleEnemyCollisionWithProjectile,
			null,
			this
		);

		this.physics.add.overlap(
			this.enemyProjectiles,
			this.player,
			this.handlePlayerCollisionWithProjectile,
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
		
		// set default cursor
		this.input.setDefaultCursor('url(assets/images/crosshair.png), pointer');

		this.levelMusic = this.sound.add('music level 1');
		this.levelMusic.play({ loop: true });
	}

	update(): void {
		// update player
		this.player.update();
		this.playerProjectiles.update();
		this.enemyProjectiles.update();

		// update enemies
		this.enemyGroup.update(this.player.x);

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
				this.sound.add('sfx player collect').play({ volume: 0.2 });
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
						texture: 'enemy',
						moveX: object.properties.moveX,
						moveY: object.properties.moveY,
						walkVel: object.properties.walkVel,
						fireRate: object.properties.fireRate,
						fireVel: object.properties.fireVel
					});
					this.enemyGroup.add(enemy);
					this.healths.set(enemy, object.properties.hp);
					break;
				}
			}
		})
	}

	private createObjects() {
		this.playerProjectiles = new ProjectileGroup(this, Projectile);
		this.enemyProjectiles = new ProjectileGroup(this, EnemyProjectile);
		this.enemyGroup = new EnemyGroup(this);
		this.loadObjectsFromTilemap();
	}

	private createEvents() {
		this.input.on('pointerdown', () => this.throwThrowable());
		this.enemyGroup.initEnemies(this.enemyProjectiles, this.player);
	}

	private handleEnemyCollisionWithProjectile(proj: Projectile, enemy: Enemy) {
		if (!proj.active) return;

		this.updateHealth(enemy, -1);
		proj.fall();
	}

	private handlePlayerCollisionWithProjectile(player: Player, proj: EnemyProjectile) {
		if (!proj.active) return;

		this.updateHealth(player, -1, true);
		proj.fall();
		this.updateHealthHudText();
	}

	private throwThrowable() {
		if (this.ammo > 0) {
			this.sound.add("sfx player throw").play();
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

	private updateHealth(obj: Phaser.GameObjects.Sprite, change: number, isPlayer: boolean = false) {
		var healths = this.healths;
		if (!healths.has(obj)) return;

		var newHP = healths.get(obj) + change;
		if (newHP <= 0) {
			if (isPlayer) {
				this.levelMusic.stop();
				this.sound.add('sfx player knocked').play({ volume: 0.6 });

				// game over
				this.scene.start("DeathScene");
			} else {
				newHP = 0;
				this.sound.add('sfx enemy knocked').play();
				healths.delete(obj);
				obj.destroy();
			}
		} else {
			if (isPlayer) {
				this.sound.add('sfx player hit').play();
			} else {
				this.sound.add('sfx enemy hit').play();
			}
			healths.set(obj, newHP);
		}
	}

	private updateHealthHudText(): void {
		this.hpText.setText('HP: ' + this.healths.get(this.player).toString());
	}
}
