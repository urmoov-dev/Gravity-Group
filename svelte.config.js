import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    csrf: {
      checkOrigin: false,
    },
    alias: {
      $lib: './src/lib'
    }
  },
  preprocess: preprocess({
    typescript: true,
    sourceMap: true
  })
};

export default config;
