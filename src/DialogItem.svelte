<script>
  export let dialog;
  import { selectedDialog } from './stores.js';
  
  let className;
  $: className = $selectedDialog === dialog.id ? 'selected' : '';
</script>

<button on:click={() => selectedDialog.set(dialog.id)} class={className}>{dialog.label}</button>

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
    background-color: rgba(0,0,0,0.06);
  }

  button.selected {
    background-color: rgba(0,0,0,0.1);
  }
</style>
