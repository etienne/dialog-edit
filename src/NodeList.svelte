<script>
  import Button from './Button.svelte';
  import NodeListItem from './NodeListItem.svelte';
  import { nodes, labelledNodeIds, selectedNode } from './stores.js';

  function addNode() {
    nodes.add();
  }

  function deleteNode() {
    nodes.delete($selectedNode);
  }
</script>

<aside>
  {#if $labelledNodeIds.length}
  <ul>
      {#each $labelledNodeIds as id}
        <li>
          <NodeListItem node={$nodes[id]}/>
        </li>
      {/each}
  </ul>
  {/if}
  
  <ul class="actions">
    <li><Button action={addNode} label="New Node" icon="plus"/></li>
    {#if $labelledNodeIds.length}
      <li><Button action={deleteNode} label="Delete Node" icon="trash"/></li>
    {/if}
  </ul>
</aside>

<style>
  ul {
    margin-bottom: 2rem;
  }

  ul.actions {
    display: flex;
  }

  ul.actions li {
    margin-right: 0.5rem;
  }
</style>