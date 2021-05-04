<script>
  import { dialogs } from './stores.js';
  import Button from './Button.svelte';
  export let branches = [];
</script>

<ul>
  {#each branches as id}
    <li class="tab">
      <button>
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

  li.tab button {
    background-color: white;
    border: none;
    border-radius: 5px;
  }

  li.action {
    margin-left: auto;
  }
</style>