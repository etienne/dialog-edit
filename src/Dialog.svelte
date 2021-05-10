<script>
  import { dialogs } from './stores.js';
  import Button from './Button.svelte';
  import Node from './Node.svelte';
  export let dialog;
</script>

<ul class="actions" class:empty={!(dialog.nodes && dialog.nodes.length)}>
  <li><Button action={() => dialogs.prependNode(dialog.id)} label="Insert Node" icon="plus"/></li>
</ul>
{#if dialog.nodes && dialog.nodes.length}
  <ul>
    {#each dialog.nodes as node, index}
      <li><Node node={node} dialogId={dialog.id} index={index}/></li>
    {/each}
  </ul>
{/if}

<style>
  ul.actions {
    opacity: 0.5;
    display: flex;
    visibility: hidden;
  }

  ul.actions:hover, ul.actions.empty {
    visibility: visible;
  }
</style>
