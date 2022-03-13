<script>
  import { afterUpdate } from 'svelte';
  import { getColorClass } from './stores/helpers';

  let domElement = false;
  export let value = '',
             disabled = false,
             type = '',
             placeholder,
             preview = false,
             focusOnMount = false,
             touch = () => {},
             keyDown = () => {},
             onChange = () => {},
             onFocus = () => {},
             onInput = () => {},
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

  function onChangeWithValue() {
    return onChange(value)
  };

  function onInputWithValue() {
    return onInput(value)
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
    on:input={onChangeWithValue}
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
    on:change={onChangeWithValue}
    on:input={onInputWithValue}
    on:focus={onFocus}
    on:blur={onBlur}
    on:keydown={keyDown}
    class={colorClass}
    class:preview
    class:character={type === 'character'}
    class:label={type === 'label'}
    class:command={type === 'command'}
    placeholder={placeholder}
    disabled={disabled}
  >
{/if}

<style>
  input, div {
    width: 100%;
    display: block;
    border: 1px solid var(--bg-color);
    padding: 0 1px;
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

  input.command {
    box-sizing: border-box;
    background: url('/command.svg') no-repeat 0.7em center var(--yellow-alpha-10);
    border-radius: 8px;
    padding: 0.5em 0.8em 0.5em 2.5em;
  }
</style>
