<script>
  import { nodes, selectedNode, nodeSequence } from './stores.js';
  import BranchTabs from './BranchTabs.svelte';
  import Node from './Node.svelte';

  let startNode;
  $: startNode = $nodes[$selectedNode];

</script>

<section>
  {#if startNode}
    {#each $nodeSequence as nodeId}
      <Node node={$nodes[nodeId]}/>
      {#if $nodes[nodeId].branchTo}
        <BranchTabs node={$nodes[nodeId]}/>
      {/if}
    {/each}
  {/if}
</section>

