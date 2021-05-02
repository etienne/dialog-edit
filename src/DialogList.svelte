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
        <DialogItem label={$dialogs[id].label}/>
      </li>
    {/each}
  {/if}
</ul>

<ButtonIcon action={() => dialogs.add()} label="New Dialog"/>
