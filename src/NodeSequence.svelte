<script>
  import { nodes, selectedNode, nodeSequence } from './stores.js';
  import Node from './Node.svelte';

  let startNode;
  $: startNode = $nodes[$selectedNode];

</script>

<section>
  {#if startNode}
    {#each $nodeSequence as nodeId}
      <Node node={$nodes[nodeId]}/>
    {/each}
  {/if}
</section>

