<script>
  import { dialogs, currentPreview, firstCharacterFieldNodes } from './stores.js';
  import Button from './Button.svelte';
  import Field from './Field.svelte';
  export let node = {}, dialogId, index, preview = false;
  let textFieldNode;

  function characterAction(newCharacter) {
    dialogs.updateNode(dialogId, index, {...node, character: newCharacter});
  }

  function textAction(newText) {
    dialogs.updateNode(dialogId, index, {...node, text: newText});
  }

  function insertNode() {
    dialogs.insertNodeAfter(dialogId, index);
  }

  function onEnterInsertNode(e) {
    if (e.key === 'Enter') {
      insertNode();
      e.preventDefault();
    };
  }

  function onEnterFocusNext(e) {
    if (e.key === 'Enter') {
      if (textFieldNode) {
        textFieldNode.focus();
      }
      e.preventDefault();
    };
  }

  function touch() {
    dialogs.updateNode(dialogId, index, {...node, newlyCreated: false});
  }

  function registerCharacterField(node) {
    if (index === 0) {
      $firstCharacterFieldNodes[dialogId] = node;
    }
  }

  function registerTextField(node) {
    textFieldNode = node;
  }
</script>

<div>
  <Field
    action={characterAction}
    focusOnMount={node.newlyCreated}
    keyDown={onEnterFocusNext}
    placeholder="Character"
    preview={preview}
    registerNode={registerCharacterField}
    touch={touch}
    type="character"
    value={node.character}
  />
  <Field
    action={textAction}
    keyDown={onEnterInsertNode}
    placeholder="Text"
    preview={preview}
    registerNode={registerTextField}
    type="autoresize"
    value={node.text}
  />
  
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
