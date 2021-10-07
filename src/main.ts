import App from './App.svelte';
import type { MarinaProvider } from 'marina-provider';

declare global {
	interface Window {
		marina:MarinaProvider;
	}
}

const app = new App({
	target: document.body,
});

export default app;
