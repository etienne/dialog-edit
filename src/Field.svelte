<script>
  import { afterUpdate } from 'svelte';
  import { getColorClass } from './stores/helpers';

  let domElement = false;
  export let value = '',
             action,
             disabled = false,
             type = '',
             placeholder,
             preview = false,
             focusOnMount = false,
             touch = () => {},
             keyDown = () => {},
             onFocus = () => {},
             onBlur = () => {},
             registerElement = () => {};

  afterUpdate(() => {
    if (focusOnMount) {
      domElement.focus();
      domElement.select();
      touch();
    }
    registerElement(domElement);
  });

  function onInput() {
    return action(value)
  };

  let colorClass;
  $: if (type == 'character') {
    colorClass = getColorClass(value);
  }
</script>

{#if type == 'autoresize'}
  <div
    contenteditable="true"
    bind:textContent={value}
    bind:this={domElement}
    class:preview
    class:disabled
    on:input={onInput}
    on:focus={onFocus}
    on:blur={onBlur}
    on:keydown={keyDown}
    data-placeholder={placeholder}
  >
  </div>
{:else}
  <input
    bind:value={value}
    bind:this={domElement}
    on:input={onInput}
    on:focus={onFocus}
    on:blur={onBlur}
    on:keydown={keyDown}
    class={colorClass}
    class:preview
    class:character={type === 'character'}
    class:label={type === 'label'}
    placeholder={placeholder}
    disabled={disabled}
  >
{/if}

<style>
  input, div {
    width: 100%;
    display: block;
    border: 1px solid var(--bg-color);
    padding: 0;
  }

  input:disabled {
    background-color: var(--bg-color);
  }

  div.preview {
    font-size: 1.5em;
    line-height: 1.3;
  }

  input::placeholder {
    color: #ccc;
  }

  div:empty:before {
    color: #ccc;
    content: attr(data-placeholder);
  }
  
  input:not(:disabled):hover, div:not(.disabled):hover {
    border: 1px solid var(--light-color);
  }

  input.character {
    text-transform: uppercase;
    font-size: 13px;
  }

  input.character:focus {
    text-transform: none;
  }

  input.label {
    font-size: 2em;
    line-height: 1.3;
    margin: 0.4em 0;
  }
</style>
