<script>
  import { nodes, selectLinkFromNode } from './stores/nodes';
  import Button from './Button.svelte';
  export let node = {};

  function merge() {
    nodes.mergeNodes(node.id, node.branchTo[0]);
  }

  function selectBranch(index) {
    nodes.selectBranch(node.id, index);
  }

  function addSibling() {
    nodes.branchFrom(node.id);
  }

  function deleteBranch() {
    const index = node.selectedBranch || 0;
    nodes.deleteBranch(node.id, index);
  }
</script>

<ul>
  {#each node.branchTo as id, index}
    <li class="tab" class:selected={(!node.selectedBranch && index == 0) || node.selectedBranch == index}>
      <button on:click={() => selectBranch(index)}>
        {($nodes[id].lines[0] && $nodes[id].lines[0].text) || 'empty branch'}
      </button>
    </li>
  {/each}
  {#if !$selectLinkFromNode}
    <li class="actions">
      {#if node.branchTo.length === 1}
        <Button action={merge} label="Merge Nodes" icon="merge" block/>
      {/if}
      <Button action={deleteBranch} label="Delete Branch" icon="trash" block/>
      <Button action={addSibling} label="Add Branch" icon="plus" block/>
    </li>
  {/if}
</ul>

<style>
  ul {
    display: flex;
    border-radius: 8px;
    font-size: 0.75em;
  }

  li.tab {
    margin-right: 0.6em;
  }

  li.tab button {
    max-width: 10em;
    overflow: hidden;
    background-color: var(--lightest-color);
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--lighter-color);
    border-radius: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  li.tab button:hover {
    background-color: var(--light-color);
  }

  li.tab.selected button {
    background-color: var(--bg-color);
    border: 1px solid var(--lighter-color);
    box-shadow: 0 3px 18px 0 var(--light-color);
  }

  li.actions {
    display: flex;
    margin-left: auto;
    padding: 0.1rem;
  }
</style>