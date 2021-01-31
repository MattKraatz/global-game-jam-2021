export interface ISpriteConstructor {
	scene: Phaser.Scene;
	x: number;
	y: number;
	texture: string;
	frame?: string | number;
}

export interface IEnemySpriteConstructor {
	scene: Phaser.Scene;
	x: number;
	y: number;
	texture: string;
	frame?: string | number;
	moveX: number;
	moveY: number;
	walkVel: number;
	fireRate: number;
	fireVel: number;
}