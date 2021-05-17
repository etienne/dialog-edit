<script>
  export let node;
  import { selectedNode } from './stores.js';
</script>

<button on:click={() => $selectedNode = node.id} class:selected={$selectedNode == node.id}>
  {node.label || 'untitled node'}
</button>

<style>
  button {
    width: 100%;
    text-align: left;
    display: block;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 0.6rem;
    cursor: pointer;
    background-color: transparent;
  }

  button:hover {
    background-color: var(--lighter-color);
  }

  button.selected {
    background-color: var(--light-color);
  }
</style>
