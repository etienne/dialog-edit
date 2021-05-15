<script>
  import { nodes } from './stores.js';
  import Button from './Button.svelte';
  import Line from './Line.svelte';
  export let node;
</script>

<div class:empty={!(node.lines && node.lines.length)}>
  <ul class="actions">
    <li><Button action={() => nodes.prependLine(node.id)} label="Insert Line" icon="plus"/></li>
  </ul>
</div>
{#if node.lines && node.lines.length}
  <ul>
    {#each node.lines as line, index}
      <li><Line line={line} nodeId={node.id} index={index}/></li>
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
