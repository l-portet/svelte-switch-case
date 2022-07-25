<script lang="ts">
  let ingredient: string = 'apple';
</script>

<svelte:head>
	<title>Svelte Switch Case</title>
</svelte:head>

<main>
  <h1>Svelte Switch Case</h1>
  <div>
    <select bind:value={ingredient}>
      <option value="apple">Apple</option>
      <option value="carrot">Carrot</option>
      <option value="ham">Ham</option>
      <option value="?">Other</option>
    </select>
    {#switch ingredient}
      {:case "apple"}
    <p>is a fruit</p>
      {:case "carrot"}
    <p>is a vegetable</p>
      {:case "ham"}
    <p>is a meat</p>
      {:default}
    <p>is a mysterious ingredient</p>
      {/switch}
  </div>
  <a href="https://github.com/l-portet/svelte-switch-case">Github</a>
</main>

<style>
  :root {
    --primary: #ff3e00;
  }

* {
  font-family: Avenir, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
}
:global(html, body, body >  *) {
  height: 100%;
}
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
main > * {
  margin: .5rem 0;
}

main > div {
  display: flex;
  align-items: center;
  gap: .3em;
}

a {
  position: fixed;
  bottom: 10px;
  color: var(--primary);
  text-decoration: none;
}
a::after {
  content: '→';
  display: inline-block;
  margin-left: 4px;
  transition: all 0.2s ease;
}
a:hover::after {
  transform: rotate(-45deg);
}
</style>