<script>
  import { dialogs } from './stores.js';
  import Button from './Button.svelte';
  import Line from './Line.svelte';
  export let dialog;
</script>

<div class:empty={!(dialog.lines && dialog.lines.length)}>
  <ul class="actions">
    <li><Button action={() => dialogs.prependLine(dialog.id)} label="Insert Line" icon="plus"/></li>
  </ul>
</div>
{#if dialog.lines && dialog.lines.length}
  <ul>
    {#each dialog.lines as line, index}
      <li><Line line={line} dialogId={dialog.id} index={index}/></li>
    {/each}
  </ul>
{/if}

<style>
  ul.actions {
    opacity: 0.5;
    display: flex;
    visibility: hidden;
  }

  div:hover ul.actions, div.empty ul.actions {
    visibility: visible;
  }
</style>
