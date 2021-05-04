<script>
  import Button from './Button.svelte';
  import DialogItem from './DialogItem.svelte';
  import { dialogs, labelledDialogIds } from './stores.js';
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
  
  <Button action={() => dialogs.add()} label="New Dialog" icon="plus"/>
</aside>

<style>
  ul {
    margin-bottom: 2rem;
  }
</style>