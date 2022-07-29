<p align="center">
  <img src="https://i.ibb.co/ZTTXt2Y/svelte-switch-case.png" alt=""  />
</p>
<h1 align="center">Svelte switch case</h1>
<p align="center">Switch case syntax for your <a href="https://svelte.dev/">Svelte</a> components.</p>

<p align="center">
  <img src="https://badgen.net/github/license/l-portet/svelte-switch-case?color=orange" />
  <img src="https://badgen.net/npm/v/svelte-switch-case" />
</p>
<p align="center">
  <a href="https://svelte-switch-case.netlify.app/">Demo</a> · <a href="https://stackblitz.com/edit/svelte-switch-case?file=src/routes/index.svelte">StackBlitz</a> · <a href="https://npmjs.com/package/svelte-switch-case">NPM Package</a>
</p>
<br/>

## :zap: Getting started

**Step 1:** Add the preprocessor to your Svelte project

```bash
# Install it:
npm i -D svelte-switch-case
```
```javascript
// Then, in your svelte.config.js
import switchCase from 'switchCase';

const config = {
  preprocess: [switchCase()],
};

export default config;
```

**Step 2:** Start using it in your Svelte components

```html
<!-- Component.svelte -->
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

<br />

## :mag: How it works

`svelte-switch-case` transpiles the following code

```html
{#switch animal}
  {:case "cat"}
    <p>meow</p>
  {:case "dog"}
    <p>woof</p>
  {:default}
    <p>oink?</p>
{/switch}
```

into `if/else` statements

```html
<!-- Injected by svelte-switch-case -->
{#if animal === "cat"}
  <p>meow</p>
{:else if animal === "dog"}
  <p>woof</p>
{:else}
  <p>oink?</p>
{/if}
```

<br />

## :raised_hands: Contribute
Found a bug or just had a cool idea? Feel free to [open an issue](https://github.com/l-portet/svelte-switch-case/issues) or [submit a PR](https://github.com/l-portet/svelte-switch-case/pulls).
