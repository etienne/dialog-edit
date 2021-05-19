<script>
  import { nodes, firstCharacterFieldElements } from './stores.js';
  import Button from './Button.svelte';
  import BranchTabs from './BranchTabs.svelte';
  import NodeEnd from './NodeEnd.svelte';
  import Line from './Line.svelte';
  import Field from './Field.svelte';
  export let node;

  function updateNode(newLabel) {
    const newNode = { ...node, label: newLabel };
    nodes.update(newNode);
  }

  function touch() {
    nodes.touch(node.id);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      if (node) {
        const firstLine = $firstCharacterFieldElements[node.id];

        if (firstLine) {
          firstLine.focus();
        }
      }
      e.preventDefault();
    };
  }

</script>

<section>
  {#if node.label || node.label === ''}
    <Field value={node.label} action={updateNode} type="label" placeholder="untitled node" focusOnMount={node.newlyCreated} touch={touch} keyDown={onKeyDown}/>
  {/if}
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
  {#if node.branchTo && node.branchTo.length}
    <BranchTabs node={node}/>
  {:else}
    <NodeEnd node={node}/>
  {/if}
</section>

<style>
  ul.actions {
    display: flex;
    visibility: hidden;
  }

  div:hover ul.actions, div.empty ul.actions {
    visibility: visible;
  }
</style>
