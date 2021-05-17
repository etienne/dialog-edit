<script>
  import { nodes, currentPreview, firstCharacterFieldElements } from './stores.js';
  import Button from './Button.svelte';
  import Field from './Field.svelte';
  export let line = {}, nodeId, index, preview = false;
  let textFieldElement;

  function characterAction(newCharacter) {
    nodes.updateLine(nodeId, index, {...line, character: newCharacter});
  }

  function textAction(newText) {
    nodes.updateLine(nodeId, index, {...line, text: newText});
  }

  function insertLine() {
    nodes.insertLineAfter(nodeId, index);
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
    nodes.updateLine(nodeId, index, {...line, newlyCreated: false});
  }

  function registerCharacterField(line) {
    if (index === 0) {
      $firstCharacterFieldElements[nodeId] = line;
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
        <li><Button action={() => nodes.branchFrom(nodeId, index)} label="Add branch" icon="addBranch"/></li>
      {/if}
      <li><Button action={() => currentPreview.set([nodeId, index])} label="Preview" icon="play"/></li>
      <li><Button action={() => nodes.deleteLine(nodeId, index)} label="Delete Line" icon="trash"/></li>
    </ul>
  {/if}
</div>

<style>
  ul.actions {
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
