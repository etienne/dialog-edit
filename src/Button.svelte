<script>
  export let action,
             block = false,
             borderless = false,
             disabled = false,
             icon = null,
             label,
             large = false,
             primary = false,
             showLabel = false;
</script>

<button on:click={action} class:borderless class:icon class:block class:large class:primary disabled={disabled} data-label={label}>
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

  button.borderless {
    background-color: transparent;
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
    white-space: nowrap;
  }

  button.icon:after {
    z-index: 100;
    transition: all 0.1s ease-in-out 0.1s;
    pointer-events: none;
    opacity: 0;
    box-sizing: border-box;
    position: absolute;
    content: attr(data-label);
    border-radius: 3px;
    background: var(--bg-color);
    color: var(--darker-color);
    box-shadow: 0 3px 10px 0 var(--medium-alpha-60);
    font-size: 0.6rem;
    padding: 0.2em 1em;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 0.6em);
  }

  button.icon:hover:after {
    opacity: 1;
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
