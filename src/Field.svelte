<script>
  export let value = '', action, type = '', placeholder;

  function onInput() {
    return action(value)
  };

  function stringToColor(string) {
    if (!string) { return 'inherit'; }

    const s = JSON.stringify(string);
    const hash = s.split("").reduce((a, _, i) => (a += s.charCodeAt(i) + (a << 5)), 0);
    return `#${(hash & 0x00ffffff).toString(16)}`;
  }

  function updateColor() {
    if (type === 'character') {
      this.style.color = stringToColor(value);
    }
  }

  function resetColor() {
    this.style.color = 'inherit';
  }

  const initialColor = type === 'character' ? stringToColor(value) : 'inherit';
</script>

{#if type == 'autoresize'}
  <div contenteditable="true" bind:textContent={value} on:input={onInput} data-placeholder={placeholder}></div>
{:else}
  <input bind:value={value} on:input={onInput} on:change={updateColor} on:focus={resetColor} class={type} placeholder={placeholder} style={`color: ${initialColor}`}>
{/if}

<style>
  input, div {
    width: 100%;
    display: block;
    border: 1px solid white;
    padding: 0;
  }

  input::placeholder {
    color: #ccc;
  }

  div:empty:before {
    color: #ccc;
    content: attr(data-placeholder);
  }
  
  input:hover, div:hover {
    border: 1px solid #ccc;
  }

  input.character {
    text-transform: uppercase;
    font-size: 13px;
  }
  
  input.label {
    font-size: 2em;
    margin: 0.8em 0;
  }
</style>
