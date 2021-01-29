import { Physics } from 'phaser';
import { GameScene } from './scenes/game-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
	title: 'Sneaker Heads',
	url: 'https://github.com/MattKraatz/global-game-jam-2021',
	version: '0.1',
	width: 768,
	height: 576,
	type: Phaser.AUTO,
	parent: 'game',
	scene: [GameScene],
	input: {
		keyboard: true
	},
	backgroundColor: '#3A99D9',
	render: { pixelArt: false, antialias: false },
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 0 }
		}
	}
};
