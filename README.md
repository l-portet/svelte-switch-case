# Svelte switch case

> Switch case syntax for your [Svelte](https://svelte.dev/) components. Inspired by this Rich Harris' talk: [Annoying Things About Svelte](https://youtu.be/dB_YjuAMH3o).

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
  {#switch animal} {:case "cat"}
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
  {#switch animal} {:case "cat"}
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
