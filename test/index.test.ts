import switchCase from '../src';

const { markup: processMarkup } = switchCase();

function minify(strings) {
  if (typeof strings === 'string') {
    strings = [strings];
  }
  return strings
    .join('')
    .replace(/[\s\t\n\r]+/g, ' ')
    .trim();
}

function runTest(code, expectedOutput) {
  code = minify(code);
  expectedOutput = minify(expectedOutput);

  const { code: output } = processMarkup({ content: code });
  expect(minify(output)).toBe(expectedOutput);
}

function runThrowingTest(code) {
  const t = () => processMarkup({ content: code });
  expect(t).toThrow(SyntaxError);
}

describe('Svelte switch case preprocessor', () => {
  it('should transpile a simple switch', () => {
    const code = `
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
    `;
    const expectedOutput = `
    <script>
      let animal = 'dog';
    </script>
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
    `;
    runTest(code, expectedOutput);
  });

  it('should handle nested switch blocks', () => {
    const code = `
    <script>
      let animal = 'dog';
      let name = 'Max';
    </script>
    <section>
      {#switch animal}
        {:case "cat"}
          <p>meow</p>
        {:case "dog"}
          <p>woof</p>
          {#switch name}
            {:case "Max"}
              <p>Hey Max</p>
            {:case "Bella"}
              <p>Hi Bella</p>
            {:default}
              <p>Hello mysterious dog</p>
          {/switch}
        {:default}
          <p>oink?</p>
      {/switch}
    </section>
    `;
    const expectedOutput = `
    <script>
      let animal = 'dog';
      let name = 'Max';
    </script>
    <section>
      <!-- Injected by svelte-switch-case -->
      {#if animal === "cat"}
        <p>meow</p>
      {:else if animal === "dog"}
        <p>woof</p>
        <!-- Injected by svelte-switch-case -->
        {#if name === "Max"}
          <p>Hey Max</p>
          {:else if name === "Bella"}
          <p>Hi Bella</p>
          {:else}
          <p>Hello mysterious dog</p>
        {/if}
        {:else}
          <p>oink?</p>
        {/if}
    </section>
    `;
    runTest(code, expectedOutput);
  });

  it('should ignore comments', () => {
    const code = `
    <script>
      let animal = 'dog';
    </script>
    <section>
      {#switch animal}
        {:case "cat"}
        <!-- This -->
          <p>meow</p>
          <!-- shouldn't -->
        {:case "dog"}
        <!-- impact -->
          <p>woof</p>
          <!-- the -->
        {:default}
        <!-- parsing -->
          <p>oink?</p>
          <!-- system -->
      {/switch}
    </section>
    `;
    const expectedOutput = `
    <script>
      let animal = 'dog';
    </script>
    <section>
      <!-- Injected by svelte-switch-case -->
      {#if animal === "cat"}
      <!-- This -->
        <p>meow</p>
        <!-- shouldn't -->
      {:else if animal === "dog"}
      <!-- impact -->
        <p>woof</p>
        <!-- the -->
      {:else}
      <!-- parsing -->
        <p>oink?</p>
        <!-- system -->
      {/if}
    </section>
    `;
    runTest(code, expectedOutput);
  });

  it(`shouldn't allow 2 defaults branches`, () => {
    const code = `
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
        {:default}
          <p>only one mysterious animal allowed</p>
      {/switch}
    </section>
    `;

    runThrowingTest(code);
  });

  it(`should have at least one branch`, () => {
    const code = `
    <script>
      let animal = 'dog';
    </script>
    <section>
      {#switch animal}
        <p>I feel lonely here</p>
      {/switch}
    </section>
    `;

    runThrowingTest(code);
  });

  it(`shouldn't have any content before branches`, () => {
    const code = `
    <script>
      let animal = 'dog';
    </script>
    <section>
    {#switch animal}
      <p>Will I get detected?</p>
      {:case "cat"}
        <p>meow</p>
      {:case "dog"}
        <p>woof</p>
      {:default}
        <p>oink?</p>
    {/switch}
    </section>
    `;

    runThrowingTest(code);
  });

  it(`shouldn't have any other branch than case and default`, () => {
    const code = `
    <script>
      let animal = 'dog';
    </script>
    <section>
    {#switch animal}
      {:case "cat"}
        <p>meow</p>
      {:invalid}
        <p>just chillin between 2 cases</p>
      {:case "dog"}
        <p>woof</p>
      {:default}
        <p>oink?</p>
    {/switch}
    </section>
    `;

    runThrowingTest(code);
  });
});
