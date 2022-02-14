import { createApp, h } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import AppLayout from './Layout.vue';
import HomePage from './pages/Home.vue';
import GamePage from './pages/Game.vue';
import NotFoundPage from './pages/404.vue';

import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const app = createApp(AppLayout);

const router = createRouter({
	routes: [
		{ path: '/', component: HomePage, name: 'Home' },
		{ path: '/game', component: GamePage, name: 'Game' },
		{ path: '/:data(.*)', component: NotFoundPage, name: 'NotFound' },
	],
	history: createWebHashHistory(),
});

app.use(router);
app.use(BootstrapVue3);

window.vm = app.mount('#app');

window.router = router;
