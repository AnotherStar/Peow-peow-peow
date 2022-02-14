import { Game } from '../Game';

export type GameRendererOptions = Pick<GameRenderer, 'container'>;
import * as PIXI from 'pixi.js';

export class GameRenderer {
	game: Game;
	container: HTMLDivElement;
	pixi: PIXI.Application;

	constructor(game: Game, options: GameRendererOptions) {
		this.game = game;
		this.container = options.container;

		this.pixi = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			resolution: window.devicePixelRatio,
			autoDensity: true,
			backgroundColor: 0x343a40,
			...options,
		});

		this.container.appendChild(this.pixi.view);

		this.pixi.stage.setTransform(100, 100, 1, 1);
	}
}
