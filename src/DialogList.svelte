<script>
  import ButtonIcon from './ButtonIcon.svelte';
  import DialogItem from './DialogItem.svelte';
  import { dialogs } from './stores.js';

  let ids;
  $: ids = Object.keys($dialogs);
</script>

<ul>
  {#if ids.length}
    {#each ids as id}
      <li>
        <DialogItem dialog={$dialogs[id]}/>
      </li>
    {/each}
  {/if}
</ul>

<ButtonIcon action={() => dialogs.add()} label="New Dialog"/>
