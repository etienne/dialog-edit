<script>
  import { dialogs, selectedDialog } from './stores.js';

  let dialog;
  $: dialog = $dialogs[$selectedDialog];
</script>

{#if dialog && dialog.label}
  <h1>{dialog.label}</h1>
{/if}

