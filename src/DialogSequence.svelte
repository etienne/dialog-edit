<script>
  import { dialogs, selectedDialog, dialogSequence, firstCharacterFieldNodes } from './stores.js';
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

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      if (startDialog) {
        const firstNode = $firstCharacterFieldNodes[startDialog.id];

        if (firstNode) {
          firstNode.focus();
        }
      }
      e.preventDefault();
    };
  }
</script>

<section>
  {#if startDialog}
    {#if startDialog.label}
      <Field value={startDialog.label} action={updateDialog} type="label" placeholder="Dialog label" focusOnMount={startDialog.newlyCreated} touch={touch} keyDown={onKeyDown}/>
    {/if}
    {#each $dialogSequence as dialogId}
      <Dialog dialog={$dialogs[dialogId]}/>
      {#if $dialogs[dialogId].branchTo}
        <BranchTabs dialog={$dialogs[dialogId]}/>
      {/if}
    {/each}
  {/if}
</section>

