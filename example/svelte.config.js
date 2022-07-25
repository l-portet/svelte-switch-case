import adapter from '@sveltejs/adapter-static';

import sveltePreprocess from 'svelte-preprocess';
import switchCase from '../dist/index.js';

const { typescript } = sveltePreprocess;

const config = {
  preprocess: [typescript(), switchCase()],

  kit: {
    adapter: adapter(),
    prerender: {
      default: true,
    },
  },
};

export default config;
