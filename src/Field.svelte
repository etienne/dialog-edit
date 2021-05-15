<script>
  import { afterUpdate, onMount } from 'svelte';
  let domNode;
  export let value = '',
             action,
             type = '',
             placeholder,
             focusOnMount = false,
             touch = () => {},
             keyDown = () => {},
             registerNode = () => {};

  onMount(() => {
    registerNode(domNode);
  });

  afterUpdate(() => {
    if (focusOnMount) {
      domNode.focus();
      domNode.select();
      touch();
    }
  });

  function onInput() {
    return action(value)
  };

  function getClass(string = '') {
    if (string.length === 0 || type !== 'character') {
      return type;
    };

    let hash = 0, i, chr;
    for (i = 0; i < string.length; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    const id = (Math.abs(hash) % 16) + 1;
    return `character color-${id}`;
  }

  let className;
  $: className = getClass(value);
</script>

{#if type == 'autoresize'}
  <div
    contenteditable="true"
    bind:textContent={value}
    bind:this={domNode}
    on:input={onInput}
    on:keydown={keyDown}
    data-placeholder={placeholder}
  >
  </div>
{:else}
  <input
    bind:value={value}
    bind:this={domNode}
    on:input={onInput}
    on:keydown={keyDown}
    list={type == 'character' ? 'characters' : undefined}
    class={className}
    placeholder={placeholder}
  >
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

  input.character.color-1:not(:focus)  { color: #FDA987; }
  input.character.color-2:not(:focus)  { color: #EE3E37; }
  input.character.color-3:not(:focus)  { color: #4DE5BC; }
  input.character.color-4:not(:focus)  { color: #B43CFF; }
  input.character.color-5:not(:focus)  { color: #78A495; }
  input.character.color-6:not(:focus)  { color: #C38E1A; }
  input.character.color-7:not(:focus)  { color: #982E16; }
  input.character.color-8:not(:focus)  { color: #25B2C6; }
  input.character.color-9:not(:focus)  { color: #2D3FCF; }
  input.character.color-10:not(:focus) { color: #4C8BFF; }
  input.character.color-11:not(:focus) { color: #FFC33E; }
  input.character.color-12:not(:focus) { color: #F9807B; }
  input.character.color-13:not(:focus) { color: #C08B93; }
  input.character.color-14:not(:focus) { color: #E9CBA9; }
  input.character.color-15:not(:focus) { color: #CAE5E2; }
  input.character.color-16:not(:focus) { color: #B4BFCB; }

  input.character:focus {
    text-transform: none;
  }

  input.label {
    font-size: 2em;
    margin: 0.8em 0;
  }
</style>