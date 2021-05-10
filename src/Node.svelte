<script>
  import { dialogs, currentPreview } from './stores.js';
  import Button from './Button.svelte';
  import Field from './Field.svelte';
  export let node = {}, dialogId, index, preview = false;

  function characterAction(newCharacter) {
    dialogs.updateNode(dialogId, index, {...node, character: newCharacter});
  }

  function textAction(newText) {
    dialogs.updateNode(dialogId, index, {...node, text: newText});
  }

  function insertNode() {
    dialogs.insertNodeAfter(dialogId, index);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      insertNode();
      e.preventDefault();
    };
  }

  function touch() {
    dialogs.updateNode(dialogId, index, {...node, newlyCreated: false});
  }
</script>

<div>
  <Field value={node.character} action={characterAction} type="character" placeholder="Character" focusOnMount={node.newlyCreated} touch={touch}/>
  <Field value={node.text} action={textAction} type="autoresize" placeholder="Text" keyDown={onKeyDown}/>
  
  {#if !preview}
    <ul class="actions">
      <li><Button action={insertNode} label="Insert Node" icon="plus"/></li>
      {#if index > 0}
        <li><Button action={() => dialogs.branchFrom(dialogId, index)} label="Add branch" icon="addBranch"/></li>
      {/if}
      <li><Button action={() => currentPreview.set([dialogId, index])} label="Preview" icon="play"/></li>
      <li><Button action={() => dialogs.deleteNode(dialogId, index)} label="Delete Node" icon="trash"/></li>
    </ul>
  {/if}
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
