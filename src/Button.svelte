<script>
  export let action, label, icon;
  let className = icon ? 'icon' : '';
</script>

<button on:click={action} class={className}>
  {#if icon}
    <img src={`/${icon}.svg`} alt={label}>
  {:else}
    {label}
  {/if}
</button>

<style>
  button {
    background-color: white;
    border: 1px solid #ccc;
    padding: 0.4em 1em;
    border-radius: 5px;
    margin-right: 1em;
    cursor: pointer;
    font-size: 13px;
    text-transform: uppercase;
  }
  
  button:last-child {
    margin-right: 0;
  }

  button:hover {
    background-color: #eee;
  }

  button img {
    display: block;
  }
  
  button.primary {
    box-shadow: 0 0 0 2px white, 0 0 0 3px #ccc;
  }

  button:disabled {
    border-color: #eee;
    cursor: auto;
  }

  button:disabled:hover {
    background-color: white;
  }

  button.primary:disabled {
    box-shadow: 0 0 0 2px white, 0 0 0 3px #eee;
  }
  
  button.icon {
    padding: 0.2em;
    margin-right: 0.6em;
  }
</style>
