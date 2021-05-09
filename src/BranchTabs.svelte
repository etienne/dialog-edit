<script>
  import { dialogs } from './stores.js';
  import Button from './Button.svelte';
  export let dialog = {};

  function selectBranch(index) {
    dialogs.selectBranch(dialog.id, index);
  }

  function addSibling() {
    dialogs.branchFrom(dialog.id);
  }

  function deleteBranch() {
    const index = dialog.selectedBranch || 0;
    dialogs.deleteBranch(dialog.id, index);
  }
</script>

<ul>
  {#each dialog.branchTo as id, index}
    <li class={`tab ${((!dialog.selectedBranch && index == 0) || dialog.selectedBranch == index) ? 'selected' : 'unselected'}`}>
      <button on:click={() => selectBranch(index)}>
        {($dialogs[id].nodes[0] && $dialogs[id].nodes[0].text) || 'empty branch'}
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
    background-color: #e5e5e5;
    display: flex;
    padding: 5px;
    border-radius: 8px;
    font-size: 0.75em;
  }

  li.tab {
    margin-right: 0.2em;
  }

  li.tab button {
    background-color: transparent;
    padding: 0.2rem 0.6rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  li.tab.selected button {
    background-color: white;
  }

  li.actions {
    display: flex;
    margin-left: auto;
    padding: 0.1rem;
  }
</style>