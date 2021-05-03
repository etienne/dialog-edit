<script>
  import { dialogs, selectedDialog } from './stores.js';
  import Button from './Button.svelte';
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
  {#if dialog}
    {#if dialog.label}
      <Field value={dialog.label} action={action} type="label" placeholder="Dialog label"/>
    {/if}
    <ul class={`actions ${dialog.nodes.length ? '' : 'empty'}`}>
      <li><Button action={() => dialogs.prependNode(dialog.id)} label="Insert Node" icon="plus"/></li>
    </ul>
    {#if dialog.nodes.length}
      <ul>
        {#each dialog.nodes as node, index}
          <li><Node node={node} dialogId={dialog.id} index={index}/></li>
        {/each}
      </ul>
    {/if}
  {:else}
    <p>← Create a dialog to get started.</p>
  {/if}
</section>

<style>
  p {
    margin-top: 0;
    opacity: 0.4;
  }

  ul.actions {
    opacity: 0;
    display: flex;
  }

  ul.actions:hover, ul.actions.empty {
    opacity: 0.5;
  }
</style>

