<script>
  export let value = '', action, type = '', placeholder;
  const onChange = () => action(value);
</script>

{#if type == 'autoresize'}
  <div contenteditable="true" bind:textContent={value} on:input={onChange} data-placeholder={placeholder}></div>
{:else}
  <input bind:value={value} on:input={onChange} class={type} placeholder={placeholder}>
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
  
  /* input.character:not(:focus) {
    color: ${stringToColor(value)};
  } */
  
  input.label {
    font-size: 2em;
    margin: 0.8em 0;
  }
</style>
