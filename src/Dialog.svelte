<script>
  import { dialogs, selectedDialog } from './stores.js';
  import Field from './Field.svelte';
  import Node from './Node.svelte';

  let dialog;
  $: dialog = $dialogs[$selectedDialog];

  function action(newLabel) {
    const newDialog = { ...dialog, label: newLabel };
    dialogs.update(newDialog);
  }
</script>

<section>
  {#if dialog && dialog.label}
    <Field value={dialog.label} action={action} type="label" placeholder="Dialog label"/>
  {/if}
  {#if dialog && dialog.nodes}
    <ul>
      {#each dialog.nodes as node, index}
        <li><Node node={node} dialogId={dialog.id} index={index}/></li>
      {/each}
    </ul>
  {/if}
</section>
