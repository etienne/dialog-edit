<script>
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action'
  import { nodes, selectLinkFromNode, selectedNode } from './stores/nodes';
  import Button from './Button.svelte';
  export let node = {};
  const flipDurationMs = 200;
  const dropTargetStyle = {};
  let items = [], selectedBranchId;
  $: items = node.branchTo.map(id => ({ id }));
  $: selectedBranchId = node.branchTo[node.selectedBranch];

  function handleDndConsider(e) {
		items = e.detail.items;
	}

  function handleDndFinalize(e) {
    const id = e.detail.info.id;
    items = e.detail.items;
		$nodes[node.id].branchTo = items.map(i => i.id);
    $nodes[node.id].selectedBranch = node.branchTo.indexOf(id);
	}

  function merge() {
    nodes.mergeNodes(node.id, node.branchTo[0]);
  }

  function selectBranch(id) {
    const index = node.branchTo.indexOf(id);
    nodes.selectBranch(node.id, index);
    $selectedNode = id;
  }

  function addSibling() {
    nodes.branchFrom(node.id);
  }

  function deleteBranch() {
    const index = node.selectedBranch || 0;
    nodes.deleteBranch(node.id, index);
  }
</script>

<section>
  <div use:dndzone={{items, flipDurationMs, dropTargetStyle, type: 'branch'}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
    {#each items as item, index (item.id)}
      <button animate:flip={{duration: flipDurationMs}} on:click={() => selectBranch(item.id)} class:selected={(!node.selectedBranch && index == 0) || selectedBranchId == item.id}>
        {($nodes[item.id] && $nodes[item.id].lines[0] && $nodes[item.id].lines[0].text) || 'empty branch'}
      </button>
    {/each}
  </div>
  {#if !$selectLinkFromNode}
    <aside>
      {#if node.branchTo.length === 1}
        <Button action={merge} label="Merge Nodes" icon="merge" block/>
      {/if}
      <Button action={deleteBranch} label="Delete Branch" icon="trash" block/>
      <Button action={addSibling} label="Add Branch" icon="plus" block/>
    </aside>
  {/if}
</section>

<style>
  section {
    display: flex;
  }

  div {
    display: flex;
    font-size: 0.75em;
  }

  button {
    margin-right: 0.6em;
    max-width: 10em;
    overflow: hidden;
    background-color: var(--lightest-color);
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--lightest-color);
    border-radius: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--light-color);
    border-color: var(--light-color);
  }

  button.selected {
    background-color: var(--bg-color);
    border: 1px solid var(--lighter-color);
    box-shadow: 0 3px 18px 0 var(--light-color);
  }

  aside {
    display: flex;
    margin-left: auto;
  }
</style>