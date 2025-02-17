import adapter from '@sveltejs/adapter-vercel';

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
  }
};

export default config;
