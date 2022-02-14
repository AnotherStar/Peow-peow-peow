<template>
	<div class="text-white">
		<div id="canvas-placeholder"></div>
		<b-button @click="game && game.addBot()">addBot</b-button>
		<input type="range" min="0" max="2" v-model="timeFactor" step="0.1" />{{ timeFactor }}
		<ControllerKeyboard v-if="user" :user="user" />
		<table v-if="game">
			<tbody>
				<tr v-for="user of game.users">
					<td>{{ user.name }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Game } from '../common/Game';
import { User } from '../common/User';
import ControllerKeyboard from '../components/ControllerKeyboard.vue';

const game = new Game({
	fps: 50,
});

const user = game.addUser();
</script>
<script setup lang="ts">
onMounted(() => {
	game.world.SetupRender(document.getElementById('canvas-placeholder') as HTMLDivElement, {
		transparent: true,
	});

	game.world.pixi.ticker.add(() => {
		game.tick();
	});
});

const timeFactor = computed<number>({
	get: () => game.timeFactor,
	set: e => (game.timeFactor = e),
});
</script>

<style>
#canvas-placeholder {
	position: absolute;
	top: 0;
	left: 0;
	pointer-events: none;
	z-index: 0;
}
</style>
