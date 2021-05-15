<script>
  import { dialogs, currentPreview, firstCharacterFieldElements } from './stores.js';
  import Button from './Button.svelte';
  import Field from './Field.svelte';
  export let line = {}, dialogId, index, preview = false;
  let textFieldElement;

  function characterAction(newCharacter) {
    dialogs.updateLine(dialogId, index, {...line, character: newCharacter});
  }

  function textAction(newText) {
    dialogs.updateLine(dialogId, index, {...line, text: newText});
  }

  function insertLine() {
    dialogs.insertLineAfter(dialogId, index);
  }

  function onEnterInsertLine(e) {
    if (e.key === 'Enter') {
      insertLine();
      e.preventDefault();
    };
  }

  function onEnterFocusNext(e) {
    if (e.key === 'Enter') {
      if (textFieldElement) {
        textFieldElement.focus();
      }
      e.preventDefault();
    };
  }

  function touch() {
    dialogs.updateLine(dialogId, index, {...line, newlyCreated: false});
  }

  function registerCharacterField(line) {
    if (index === 0) {
      $firstCharacterFieldElements[dialogId] = line;
    }
  }

  function registerTextField(line) {
    textFieldElement = line;
  }
</script>

<div>
  <Field
    action={characterAction}
    focusOnMount={line.newlyCreated}
    keyDown={onEnterFocusNext}
    placeholder="Character"
    preview={preview}
    registerElement={registerCharacterField}
    touch={touch}
    type="character"
    value={line.character}
  />
  <Field
    action={textAction}
    keyDown={onEnterInsertLine}
    placeholder="Text"
    preview={preview}
    registerElement={registerTextField}
    type="autoresize"
    value={line.text}
  />
  
  {#if !preview}
    <ul class="actions">
      <li><Button action={insertLine} label="Insert Line" icon="plus"/></li>
      {#if index > 0}
        <li><Button action={() => dialogs.branchFrom(dialogId, index)} label="Add branch" icon="addBranch"/></li>
      {/if}
      <li><Button action={() => currentPreview.set([dialogId, index])} label="Preview" icon="play"/></li>
      <li><Button action={() => dialogs.deleteLine(dialogId, index)} label="Delete Line" icon="trash"/></li>
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
