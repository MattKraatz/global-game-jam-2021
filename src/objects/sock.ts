import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { GameScene } from '../scenes/game-scene';

export class Sock extends Phaser.GameObjects.Sprite {

	private currentScene: Phaser.Scene;
	private baseY        = 0;
	private bobCyclePos  = 0;
	private bobMagnitude = 4;
	private bobFreq      = 103;

	constructor(aParams: ISpriteConstructor) {
		super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

		this.initVariables();
		this.currentScene = aParams.scene;
		this.initImage();
		this.initEvents();

		this.scene.add.existing(this);
	}

	private initVariables(): void {
		this.baseY = this.y;
	}

	private initImage(): void {
		this.setOrigin(0, 0);
		this.anims.play("sock", true);

		// Alternate between flipping the sock along the X axis.
		var gameScene : GameScene = (<GameScene>this.scene);
		this.setFlipX(gameScene.lastSockWasFlipped);
		gameScene.lastSockWasFlipped = !gameScene.lastSockWasFlipped;
	}

	private initEvents(): void {}

	update(): void {
		this.bobCyclePos++;
		if (this.bobCyclePos > this.bobFreq) this.bobCyclePos = 1;
		var v = this.bobMagnitude * Math.cos((this.bobCyclePos / this.bobFreq) * (2 * Math.PI));
		this.y = this.baseY + v;
	}
}
