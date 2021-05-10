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

  function touch() {
    dialogs.touch(startDialog.id);
  }
</script>

<section>
  {#if startDialog}
    {#if startDialog.label}
      <Field value={startDialog.label} action={updateDialog} type="label" placeholder="Dialog label" focusOnMount={startDialog.newlyCreated} touch={touch}/>
    {/if}
    {#each $dialogSequence as dialogId}
      <Dialog dialog={$dialogs[dialogId]}/>
      {#if $dialogs[dialogId].branchTo}
        <BranchTabs dialog={$dialogs[dialogId]}/>
      {/if}
    {/each}
  {/if}
</section>

<style>
  p {
    margin-top: 0;
    opacity: 0.4;
  }
</style>
