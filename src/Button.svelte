<script>
  export let action, label, icon = null, block = false, large = false, primary = false, showLabel = false, disabled = false;
</script>

<button on:click={action} class:icon class:block class:large class:primary disabled={disabled} data-label={label}>
  {#if icon}
    <img src={`/${icon}.svg`} alt={label}>
  {/if}
  {#if !icon || showLabel}
    <span>{label}</span>
  {/if}
</button>

<style>
  button {
    display: flex;
    background-color: var(--medium-alpha-30);
    border: 0;
    padding: 0.4em 1em;
    border-radius: 5px;
    margin-right: 1em;
    cursor: pointer;
    font-size: 0.75em;
    line-height: 19px;
    color: var(--dark-color);
  }

  button:last-child {
    margin-right: 0;
  }

  button:hover {
    background-color: var(--light-color);
  }

  button.block {
    display: block;
  }

  button.primary {
    box-shadow: 0 0 0 2px white, 0 0 0 3px var(--light-color);
  }

  button.large {
    padding: 0.8em 2em;
  }

  button:disabled {
    opacity: 0.4;
    cursor: auto;
  }

  button:disabled:hover {
    background-color: var(--medium-alpha-30);
  }

  button.primary:disabled {
    box-shadow: 0 0 0 2px white, 0 0 0 3px var(--light-color);
  }
  
  button.icon {
    padding: 0.25em;
    margin-right: 0.6em;
    position: relative;
  }

  button.icon.large {
    padding: 0.4em;
  }

  button.icon:last-child {
    margin-right: 0;
  }

  button img {
    display: block;
  }

  button.icon span {
    padding: 0 0.4em;
  }
</style>
