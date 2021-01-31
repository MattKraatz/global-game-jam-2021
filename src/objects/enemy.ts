import { IEnemySpriteConstructor, ISpriteConstructor } from '../interfaces/sprite.interface';
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
	private xyOrigin: { x: number, y: number };
	private xyDestination: { x: number, y: number };
	private moveToOrigin: boolean;
	private fireRate: number;
	private fireVelocity: number;

	constructor(aParams: IEnemySpriteConstructor) {
		super(
			aParams.scene,
			aParams.x,
			aParams.y,
			aParams.texture,
			aParams.frame
		);

		this.currentScene = aParams.scene;
		this.initImage();

		this.scene.add.existing(this);
		this.body.setSize(8, 12);
		this.body.setOffset(4, 5);
		this.initVariables(aParams);
	}

	private initImage(): void {
		this.setOrigin(0, 0);
		this.anims.play("enemyWalk", true);
		this.currentScene.physics.world.enable(this);
	}

	private initVariables(aParams: IEnemySpriteConstructor) {
		this.walkingSpeed = aParams.walkVel;
		this.xyOrigin = { x: aParams.x, y: aParams.y };
		this.xyDestination = { x: aParams.x + aParams.moveX, y: aParams.y + aParams.moveY };
		this.moveToOrigin = true;
		this.fireRate = aParams.fireRate;
		this.fireVelocity = aParams.fireVel;
	}

	initThrowing(projectiles: ProjectileGroup, player: Player): void {
		this.projectiles = projectiles;
		this.player = player;

		this.scene.time.delayedCall(this.fireRate, this.throwAtPlayer, null, this);
	}

	private throwAtPlayer() {
		if (this.active) {
			this.projectiles.sendIt(this.x, this.y, this.player, this.fireVelocity);
			this.scene.time.delayedCall(this.fireRate, this.throwAtPlayer, null, this);
		}
	}
	
	update(lookX: number): void {
		if (lookX < this.x) {
			this.setFlip(true, false);
		} else {
			this.setFlip(false, false);
		}
		this.updateMovement();
	}

	private updateMovement(): void {
		const wrapX = Phaser.Math.Wrap(this.x, this.xyOrigin.x, this.xyDestination.x);
		const wrapY = Phaser.Math.Wrap(this.y, this.xyOrigin.y, this.xyDestination.y);
		if (!this.body.velocity.x || (!!wrapX && wrapX !== this.x) || !this.body.velocity.y || (!!wrapY && wrapY !== this.y)) {
			if (this.moveToOrigin) {
				this.scene.physics.moveTo(this, this.xyOrigin.x, this.xyOrigin.y, this.walkingSpeed);
			} else {
				this.scene.physics.moveTo(this, this.xyDestination.x, this.xyDestination.y, this.walkingSpeed);
			}
			this.moveToOrigin = !this.moveToOrigin;
		}
	}

	knockout() {
        this.destroy();
    }
}