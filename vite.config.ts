import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: 'localhost',
		port: 5175,
		headers: {
			'Content-Security-Policy': `
				default-src 'self';
				script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com;
				style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
				font-src 'self' https://fonts.gstatic.com;
				img-src 'self' data: https://*.googleusercontent.com https://*.google.com https://*.googleapis.com;
				frame-src 'self' https://*.firebaseapp.com https://*.google.com;
				connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.google.com wss://*.firebaseio.com https://*.firebaseapp.com;
				form-action 'self';
			`.replace(/\s+/g, ' ').trim()
		}
	}
}); 