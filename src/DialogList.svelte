<script>
  import Button from './Button.svelte';
  import DialogItem from './DialogItem.svelte';
  import { dialogs } from './stores.js';

  let ids;
  $: ids = Object.keys($dialogs);
</script>

<aside>
  {#if ids.length}
  <ul>
      {#each ids as id}
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