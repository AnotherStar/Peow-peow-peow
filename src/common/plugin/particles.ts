export const fireEmitter = {
	lifetime: {
		min: 0.1,
		max: 0.5,
	},
	frequency: 1 / 1000,
	emitterLifetime: 0,
	maxParticles: 1000,
	addAtBack: true,
	pos: {
		x: 0,
		y: 0,
	},
	behaviors: [
		{
			type: 'alpha',
			config: {
				alpha: {
					list: [
						{
							time: 0,
							value: 0.62,
						},
						{
							time: 1,
							value: 0,
						},
					],
				},
			},
		},
		{
			type: 'moveSpeedStatic',
			config: {
				min: 500 / 5,
				max: 500 / 5,
			},
		},
		{
			type: 'scale',
			config: {
				scale: {
					list: [
						{
							time: 0,
							value: 0.25 / 5,
						},
						{
							time: 1,
							value: 0.75 / 5,
						},
					],
				},
				minMult: 1,
			},
		},
		{
			type: 'color',
			config: {
				color: {
					list: [
						{
							time: 0,
							value: 'fff191',
						},
						{
							time: 1,
							value: 'ff622c',
						},
					],
				},
			},
		},
		{
			type: 'rotation',
			config: {
				accel: 0,
				minSpeed: 50,
				maxSpeed: 50,
				minStart: 265,
				maxStart: 275,
			},
		},
		{
			type: 'textureRandom',
			config: {
				textures: ['/particle.png', '/fire.png'],
			},
		},
		{
			type: 'spawnShape',
			config: {
				type: 'torus',
				data: {
					x: 0,
					y: 0,
					radius: 5,
					innerRadius: 0,
					affectRotation: false,
				},
			},
		},
	],
};
