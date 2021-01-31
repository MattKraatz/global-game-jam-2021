import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Player } from './player';
import { ProjectileGroup } from './projectile';

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
	constructor(scene: Phaser.Scene) {
		super(scene.physics.world, scene);
	}

	initEnemies(projectiles: ProjectileGroup, player: Player) {
		this.children.entries.forEach((e: Enemy) => e.initThrowing(projectiles, player))
	}

	update(playerX: number) {
		this.children.entries.forEach(e => e.update(playerX));
	}
}

export class Enemy extends Phaser.GameObjects.Sprite {
	body: Phaser.Physics.Arcade.Body;

	private currentScene: Phaser.Scene;
	private projectiles: ProjectileGroup;
	private player: Player;
	private walkingSpeed: number;
	private xyDirection: { x: number, y: number };

	constructor(aParams: ISpriteConstructor) {
		super(
			aParams.scene,
			aParams.x,
			aParams.y,
			aParams.texture,
			aParams.frame
		);

		this.initVariables();
		this.currentScene = aParams.scene;
		this.initImage();

		this.scene.add.existing(this);
		this.body.setSize(8, 12);
		this.body.setOffset(4, 5);
		this.updateVelocity();
	}

	private initVariables(): void {
		this.walkingSpeed = 40;

		this.xyDirection = {
			x: Phaser.Math.Between(-1, 1),
			y: Phaser.Math.Between(-1, 1)
		}
	}

	private initImage(): void {
		this.setOrigin(0, 0);
		this.anims.play("enemyWalk", true);
		this.currentScene.physics.world.enable(this);
	}

	initThrowing(projectiles: ProjectileGroup, player: Player): void {
		this.projectiles = projectiles;
		this.player = player;

		this.scene.time.delayedCall(Phaser.Math.Between(800,2000), this.throwAtPlayer, null, this);
	}

	private throwAtPlayer() {
		if (this.active) {
			this.projectiles.sendIt(this.x, this.y, this.player);
			this.scene.time.delayedCall(Phaser.Math.Between(800,2000), this.throwAtPlayer, null, this);
		}
	}
	
	update(lookX: number): void {
		if (lookX < this.x) {
			this.setFlip(true, false);
		} else {
			this.setFlip(false, false);
		}
	}

	private updateVelocity(): void {
		this.xyDirection = {
			x: this.xyDirection.x * -1,
			y: this.xyDirection.y * -1
		}
		if (this.body) {
			this.body.setVelocityX(this.xyDirection.x * this.walkingSpeed);
			this.body.setVelocityY(this.xyDirection.y * this.walkingSpeed);
			setTimeout(() => this.updateVelocity(), 900);
		}
	}

	knockout() {
        this.destroy();
    }
}