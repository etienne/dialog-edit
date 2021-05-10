<script>
  import Button from './Button.svelte';
  import DialogItem from './DialogItem.svelte';
  import { dialogs, labelledDialogIds, selectedDialog } from './stores.js';

  function addDialog() {
    dialogs.add();
  }

  function deleteDialog() {
    dialogs.delete($selectedDialog);
  }
</script>

<aside>
  {#if $labelledDialogIds.length}
  <ul>
      {#each $labelledDialogIds as id}
        <li>
          <DialogItem dialog={$dialogs[id]}/>
        </li>
      {/each}
  </ul>
  {/if}
  
  <ul class="actions">
    <li><Button action={addDialog} label="New Dialog" icon="plus"/></li>
    {#if $labelledDialogIds.length}
      <li><Button action={deleteDialog} label="Delete Dialog" icon="trash"/></li>
    {/if}
  </ul>
</aside>

<style>
  ul {
    margin-bottom: 2rem;
  }

  ul.actions {
    display: flex;
  }

  ul.actions li {
    margin-right: 0.5rem;
  }
</style>