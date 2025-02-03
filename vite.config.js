console.log(process.env.OPENAI_API_KEY);

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default {
  plugins: [sveltekit()],
  define: {
    'process.env': process.env,
  },
};
