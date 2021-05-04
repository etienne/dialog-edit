<script>
  import { dialogs, selectedDialog, dialogSequence } from './stores.js';
  import BranchTabs from './BranchTabs.svelte';
  import Dialog from './Dialog.svelte';
  import Field from './Field.svelte';

  let startDialog;
  $: startDialog = $dialogs[$selectedDialog];

  function updateDialog(newLabel) {
    const newDialog = { ...startDialog, label: newLabel };
    dialogs.update(newDialog);
  }
</script>

<section>
  {#if startDialog}
    {#if startDialog.label}
      <Field value={startDialog.label} action={updateDialog} type="label" placeholder="Dialog label"/>
    {/if}
    {#each $dialogSequence as dialogId}
      <Dialog dialog={$dialogs[dialogId]}/>
      {#if $dialogs[dialogId].branchTo}
        <BranchTabs branches={$dialogs[dialogId].branchTo}/>
      {/if}
    {/each}
  {:else}
    <p>← Create a dialog to get started.</p>
  {/if}
</section>

<style>
  p {
    margin-top: 0;
    opacity: 0.4;
  }
</style>
