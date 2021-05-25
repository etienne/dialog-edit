<script>
  import { nodes, currentPreview, firstCharacterFieldElements, selectLinkFromNode } from './stores.js';
  import Button from './Button.svelte';
  import Field from './Field.svelte';
  export let line = {}, nodeId, index, preview = false, disabled = false;
  let node, textFieldElement, isLastLine, canLink, selectable;
  $: node = $nodes[nodeId];
  $: isLastLine = index == node.lines.length - 1;
  $: canLink = isLastLine && !node.linkTo && !(node.branchTo && node.branchTo.length);
  $: selectable = !!$selectLinkFromNode && !($selectLinkFromNode === nodeId && isLastLine);

  function characterAction(newCharacter) {
    nodes.updateLine(nodeId, index, {...line, character: newCharacter});
  }

  function selectAsTarget() {
    if ($selectLinkFromNode && selectable) {
      nodes.link($selectLinkFromNode, nodeId, index);
      $selectLinkFromNode = null;
    }
  }

  function textAction(newText) {
    nodes.updateLine(nodeId, index, {...line, text: newText});
  }

  function insertLine() {
    nodes.insertLineAfter(nodeId, index);
  }

  function linkTo(e) {
    $selectLinkFromNode = nodeId;
    e.stopPropagation();
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

  function registerCharacterField(element) {
    if (index === 0) {
      $firstCharacterFieldElements[nodeId] = element;
    }
  }

  function registerTextField(line) {
    textFieldElement = line;
  }
</script>

<div on:click={selectAsTarget} class:selectable>
  <Field
    action={characterAction}
    disabled={disabled}
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
    disabled={disabled}
    keyDown={onEnterInsertLine}
    placeholder="Text"
    preview={preview}
    registerElement={registerTextField}
    type="autoresize"
    value={line.text}
  />
  
  {#if !preview}
    <ul class="actions" class:disabled={disabled}>
      <li><Button action={insertLine} label="Insert Line" icon="plus"/></li>
      {#if index > 0}
        <li><Button action={() => nodes.branchFrom(nodeId, index)} label="Add branch" icon="addBranch"/></li>
      {/if}
      {#if canLink}
        <li><Button action={linkTo} label="Link to node…" icon="link"/></li>
      {/if}
      <li><Button action={() => currentPreview.set([nodeId, index])} label="Preview" icon="play"/></li>
      <li><Button action={() => nodes.deleteLine(nodeId, index)} label="Delete Line" icon="trash"/></li>
    </ul>
  {/if}
</div>

<style>
  div.selectable {
    cursor: pointer;
    position: relative;
  }

  div.selectable:hover:after {
    position: absolute;
    content: '';
    background-color: var(--yellow-alpha-20);
    border-radius: 1em;
    top: -1em;
    left: -1em;
    right: -1em;
    bottom: 1em;
  }

  ul.actions {
    visibility: hidden;
    display: flex;
  }

  ul.actions li {
    margin-right: 0.5rem;
  }

  div:hover ul.actions:not(.disabled) {
    visibility: visible;
  }
</style>
