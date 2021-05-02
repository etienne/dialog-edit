<script>
  import { dialogs, selectedDialog } from './stores.js';
  import Field from './Field.svelte';

  let dialog;
  $: dialog = $dialogs[$selectedDialog];

  function action(newLabel) {
    const newDialog = { ...dialog, label: newLabel };
    dialogs.update(newDialog);
  }
</script>

<section>
  {#if dialog && dialog.label}
    <Field value={dialog.label} action={action} type="label"/>
  {/if}
</section>
