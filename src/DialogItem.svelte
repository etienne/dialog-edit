<script>
  export let dialog;
  import { selectedDialog } from './stores.js';
  
  let className;
  $: className = $selectedDialog === dialog.id ? 'selected' : '';
</script>

<button on:click={() => selectedDialog.set(dialog.id)} class={className}>{dialog.label}</button>

<style>
  .selected {
    background-color: red;
  }
</style>
