export const generateUuid = (): string => {
	return Math.random().toString().slice(2, 7);
};

export const between = (
	a: number,
	b: number,
	x: number,
	min: number = 0,
	max: number = 1,
	enable_limit: boolean = false,
): number => {
	var y = (x - a) / (b - a);
	var result = min + (max - min) * y;
	if (enable_limit) {
		if (max > min) {
			if (result < min) {
				result = min;
			} else if (result > max) {
				result = max;
			}
		} else {
			if (result > min) {
				result = min;
			} else if (result < max) {
				result = max;
			}
		}
	}
	return result;
};

export const randomBetween = (min: number, max: number, round: boolean = true): number => {
	const result = between(0, 1, Math.random(), min, max, true);
	return round ? Math.round(result) : result;
};

export const getRandomFromArray = <T>(array: T[]): T => {
	const index = Math.floor(Math.random() * array.length);
	return array[index];
};

export const getRandomBrightColor = (): string => {
	const rgb = [randomBetween(100, 255), randomBetween(100, 255), randomBetween(100, 255)];
	rgb[randomBetween(0, 2)] = 0;
	if (rgb.reduce((a, x) => a + x, 0) < 400) return getRandomBrightColor();
	return `rgba(${rgb.join(', ')})`;
};
