<script>
  import { dialogs, selectedBranches } from './stores.js';
  import Button from './Button.svelte';
  export let dialog = {};

  function updateBranch(index) {
    selectedBranches.update(b => {
      return {...b, [dialog.id]: index };
    });
  }
</script>

<ul>
  {#each dialog.branchTo as id, index}
    <li class={`tab ${((!$selectedBranches[dialog.id] && index == 0) || $selectedBranches[dialog.id] == index) ? 'selected' : 'unselected'}`}>
      <button on:click={() => updateBranch(index)}>
        {($dialogs[id].nodes[0] && $dialogs[id].nodes[0].text) || 'empty branch'}
      </button>
    </li>
  {/each}
  <li class="action"><Button action={() => {}} label="Add Branch" icon="plus" block/></li>
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
    border: none;
    border-radius: 5px;
  }

  li.tab.selected button {
    background-color: white;
  }

  li.action {
    margin-left: auto;
  }
</style>