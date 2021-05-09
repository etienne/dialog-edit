<script>
  import Button from './Button.svelte';
  import DialogItem from './DialogItem.svelte';
  import { dialogs, labelledDialogIds, selectedDialog } from './stores.js';

  function addNode() {
    dialogs.add();
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
  
  <Button action={addNode} label="New Dialog" icon="plus"/>
</aside>

<style>
  ul {
    margin-bottom: 2rem;
  }
</style>