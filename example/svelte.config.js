import adapter from '@sveltejs/adapter-netlify';

import sveltePreprocess from 'svelte-preprocess';
import switchCase from '../dist/index.js';

const { typescript } = sveltePreprocess;

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [typescript(), switchCase()],

  kit: {
    adapter: adapter(),
  },
};

export default config;
