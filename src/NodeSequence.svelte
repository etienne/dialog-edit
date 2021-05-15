<script>
  import { nodes, selectedNode, nodeSequence, firstCharacterFieldElements } from './stores.js';
  import BranchTabs from './BranchTabs.svelte';
  import Node from './Node.svelte';
  import Field from './Field.svelte';

  let startNode;
  $: startNode = $nodes[$selectedNode];

  function updateNode(newLabel) {
    const newNode = { ...startNode, label: newLabel };
    nodes.update(newNode);
  }

  function touch() {
    nodes.touch(startNode.id);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      if (startNode) {
        const firstLine = $firstCharacterFieldElements[startNode.id];

        if (firstLine) {
          firstLine.focus();
        }
      }
      e.preventDefault();
    };
  }
</script>

<section>
  {#if startNode}
    {#if startNode.label}
      <Field value={startNode.label} action={updateNode} type="label" placeholder="Node label" focusOnMount={startNode.newlyCreated} touch={touch} keyDown={onKeyDown}/>
    {/if}
    {#each $nodeSequence as nodeId}
      <Node node={$nodes[nodeId]}/>
      {#if $nodes[nodeId].branchTo}
        <BranchTabs node={$nodes[nodeId]}/>
      {/if}
    {/each}
  {/if}
</section>

