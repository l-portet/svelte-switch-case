<p align="center">
  <img src="https://i.ibb.co/x8dQHbq/banner.png" alt=""  />
</p>
<p align="center">
  <img src="https://badgen.net/github/license/l-portet/svelte-switch-case?color=orange" />
  <img src="https://badgen.net/npm/v/svelte-switch-case" />
</p>
<p align="center">
  <a href="https://svelte-switch-case.netlify.app/">Demo</a> · <a href="https://stackblitz.com/edit/svelte-switch-case?file=src/routes/index.svelte">StackBlitz</a> · <a href="https://npmjs.com/package/svelte-switch-case">NPM Package</a>
</p>

# Svelte switch case

> Switch case syntax for your [Svelte](https://svelte.dev/) components. Inspired by this Rich Harris' talk: [Annoying Things About Svelte](https://youtu.be/dB_YjuAMH3o).

<!--[StackBlitz](https://stackblitz.com/edit/svelte-switch-case?file=src/routes/index.svelte)

<p>
  <a href="https://github.com/l-portet/svelte-switch-case/blob/master/LICENSE.md">
    <img src="https://badgen.net/github/license/l-portet/svelte-switch-case?color=orange"/>
  </a>
  <a href="https://npmjs.com/package/svelte-switch-case">
    <img src="https://badgen.net/npm/v/svelte-switch-case"/>
  </a>
</p>-->

## Getting started

1. Install `svelte-switch-case`

```bash
npm i -D svelte-switch-case
```

2. Add it to your Svelte configuration

```javascript
// in your svelte.config.js
import switchCase from 'switchCase';

const config = {
  preprocess: [switchCase()],
};

export default config;
```

3. Start using it in your Svelte components:

```html
<script>
  let animal = 'dog';
</script>

<section>
  {#switch animal}
    {:case "cat"}
      <p>meow</p>
    {:case "dog"}
      <p>woof</p>
    {:default}
      <p>oink?</p>
  {/switch}
</section>
```

## How it works

`svlete-switch-case` transpiles the following code

```html
<section>
  {#switch animal}
    {:case "cat"}
      <p>meow</p>
    {:case "dog"}
      <p>woof</p>
    {:default}
      <p>oink?</p>
  {/switch}
</section>
```

into `if/else` statements

```html
<section>
  <!-- Injected by svelte-switch-case -->
  {#if animal === "cat"}
    <p>meow</p>
  {:else if animal === "dog"}
    <p>woof</p>
  {:else}
    <p>oink?</p>
  {/if}
</section>
```
