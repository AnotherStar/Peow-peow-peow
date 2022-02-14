export const fireEmitter = {
	lifetime: {
		min: 0.1,
		max: 0.25,
	},
	frequency: 1 / 500,
	emitterLifetime: 0,
	maxParticles: 1000,
	addAtBack: false,
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
							value: 1,
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
				min: 50,
				max: 50,
			},
		},
		{
			type: 'scale',
			config: {
				scale: {
					list: [
						{
							time: 0,
							value: 0.05 / 5,
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
					radius: 3,
					innerRadius: 0,
					affectRotation: false,
				},
			},
		},
	],
};
