<script>
  import { nodes } from './stores.js';
  import Button from './Button.svelte';
  export let node = {};

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
  <li class="actions">
    <Button action={deleteBranch} label="Delete Branch" icon="trash" block/>
    <Button action={addSibling} label="Add Branch" icon="plus" block/>
  </li>
</ul>

<style>
  ul {
    display: flex;
    padding: 1em 0;
    border-radius: 8px;
    font-size: 0.75em;
  }

  li.tab {
    margin-right: 0.2em;
  }

  li.tab button {
    max-width: 10em;
    overflow: hidden;
    background-color: transparent;
    padding: 0.2rem 0.6rem;
    border: none;
    border-radius: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  li.tab button:hover {
    background-color: var(--lighter-color);
  }

  li.tab.selected button {
    background-color: var(--light-color);
  }

  li.actions {
    display: flex;
    margin-left: auto;
    padding: 0.1rem;
  }
</style>