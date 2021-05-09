<script>
  import { dialogs } from './stores.js';
  import Button from './Button.svelte';
  import Field from './Field.svelte';
  export let node = {}, dialogId, index;

  function characterAction(newCharacter) {
    dialogs.updateNode(dialogId, index, {...node, character: newCharacter});
  }

  function textAction(newText) {
    dialogs.updateNode(dialogId, index, {...node, text: newText});
  }
</script>

<div>
  <Field value={node.character} action={characterAction} type="character" placeholder="Character"/>
  <Field value={node.text} action={textAction} type="autoresize" placeholder="Text"/>
  
  <ul class="actions">
    <li><Button action={() => dialogs.insertNodeAfter(dialogId, index)} label="Insert Node" icon="plus"/></li>
    {#if index > 0}
      <li><Button action={() => dialogs.branchFrom(dialogId, index)} label="Add branch" icon="addBranch"/></li>
    {/if}
    <li><Button action={() => dialogs.deleteNode(dialogId, index)} label="Delete Node" icon="trash"/></li>
  </ul>
</div>

<style>
  ul.actions {
    opacity: 0.5;
    visibility: hidden;
    display: flex;
  }

  ul.actions li {
    margin-right: 0.5rem;
  }

  div:hover ul.actions {
    visibility: visible;
  }
</style>
