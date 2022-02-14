<template>
	<div>
		<b-button v-if="!user.isSpawned" @click="user.spawn()"> Spawn </b-button>
		<pre>{{ user.getInfo() }}</pre>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, PropType } from 'vue';
import { User } from '../common/User';

const { user } = defineProps({
	user: {
		type: Object as PropType<User>,
		required: true,
	},
});

onMounted(() => {
	document.addEventListener('keydown', e => {
		switch (e.key) {
			case 'ArrowUp':
				user.controller.y = 1;
				e.preventDefault();
				break;
			case 'ArrowDown':
				user.controller.y = -1;
				e.preventDefault();
				break;
			case 'ArrowLeft':
				user.controller.x = -1;
				e.preventDefault();
				break;
			case 'ArrowRight':
				user.controller.x = 1;
				e.preventDefault();
				break;
			case ' ':
				user.controller.primary = 1;
				e.preventDefault();
				break;
		}
	});

	document.addEventListener('keyup', e => {
		switch (e.key) {
			case 'ArrowUp':
			case 'ArrowDown':
				user.controller.y = 0;
				e.preventDefault();
				break;
			case 'ArrowLeft':
			case 'ArrowRight':
				user.controller.x = 0;
				e.preventDefault();
				break;
			case ' ':
				user.controller.primary = 0;
				e.preventDefault();
				break;
		}
	});
});

onBeforeUnmount(() => {
	document.addEventListener('keydown', e => {
		switch (e.key) {
			case 'ArrowUp':
				user.controller.y = 1;
				e.preventDefault();
				break;
			case 'ArrowDown':
				user.controller.y = -1;
				e.preventDefault();
				break;
			case 'ArrowLeft':
				user.controller.x = -1;
				e.preventDefault();
				break;
			case 'ArrowRight':
				user.controller.x = 1;
				e.preventDefault();
				break;
			case 'Space':
				user.controller.primary = 1;
				e.preventDefault();
				break;
		}
	});
});
</script>
