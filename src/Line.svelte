<script>
  import { characters, nodes, selectLinkFromNode } from './stores/nodes';
  import { playerHistory } from './stores/player';
  import { firstCharacterFieldElements } from './stores/ui';
  import Button from './Button.svelte';
  import CharacterList from './CharacterList.svelte';
  import Field from './Field.svelte';
  export let line = {}, nodeId, index, preview = false, disabled = false;
  let node, textFieldElement, isLastLine, canLink, selectable, showCharacterList, selectedCharacter, filteredCharacters;
  $: node = $nodes[nodeId];
  $: isLastLine = node && (index == node.lines.length - 1);
  $: canLink = isLastLine && !node.linkTo && !(node.branchTo && node.branchTo.length);
  $: selectable = !!$selectLinkFromNode && !($selectLinkFromNode === nodeId && isLastLine);
  $: filteredCharacters = $characters.filter(c => c !== line.character);

  function characterAction(newCharacter) {
    const matchingCharacterIndexes = filteredCharacters.map((c, i) => {
      return c.toLowerCase().indexOf(newCharacter.toLowerCase()) >= 0 ? i : false
    }).filter(c => c !== false);

    if (matchingCharacterIndexes.length) {
      selectedCharacter = matchingCharacterIndexes[0];
    }

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

  function insertCommand() {
    nodes.insertCommandAfter(nodeId, index);
  }

  function linkTo(e) {
    $selectLinkFromNode = nodeId;
    e.stopPropagation();
  }

  function play() {
    playerHistory.append(nodeId, index);
  }

  function onEnterInsertLine(e) {
    if (e.key === 'Enter') {
      insertLine();
      e.preventDefault();
    };
  }

  function onKeyDownCharacter(e) {
    const max = filteredCharacters.length - 1;
    if (e.key === 'Enter') {
      if (selectedCharacter >= 0) {
        characterAction(filteredCharacters[selectedCharacter]);
        selectedCharacter = undefined;
      }
      if (textFieldElement) {
        textFieldElement.focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      showCharacterList = true;
      selectedCharacter = selectedCharacter >= 0 ? Math.min(selectedCharacter + 1, max) : 0;
    } else if (e.key === 'ArrowUp') {
      showCharacterList = true;
      selectedCharacter = selectedCharacter <= max ? Math.max(selectedCharacter - 1, 0) : max;
    } else if (e.key === 'Escape') {
      selectedCharacter = undefined;
      showCharacterList = false;
    }
  }

  function onCharacterSelect(index) {
    characterAction(filteredCharacters[index]);
    showCharacterList = false;
    selectedCharacter = undefined;
  }

  function onCharacterFocus() {
    showCharacterList = true;
  }

  function onCharacterBlur() {
    showCharacterList = false;
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
  {#if line.type === 'command'}
    <Field
      action={textAction}
      disabled={disabled}
      keyDown={onEnterInsertLine}
      placeholder="Command"
      preview={preview}
      registerElement={registerTextField}
      type="command"
      value={line.text}
    />
  {:else}
    <Field
      action={characterAction}
      disabled={disabled}
      focusOnMount={line.newlyCreated}
      keyDown={onKeyDownCharacter}
      placeholder="Character"
      onFocus={onCharacterFocus}
      onBlur={onCharacterBlur}
      preview={preview}
      registerElement={registerCharacterField}
      touch={touch}
      type="character"
      value={line.character}
    />

    {#if showCharacterList && filteredCharacters.length}
      <CharacterList characters={filteredCharacters} selectionIndex={selectedCharacter} {onCharacterSelect}/>
    {/if}

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
  {/if}
  
  {#if !preview}
    <ul class="actions" class:disabled={disabled}>
      <li><Button action={insertLine} label="Insert Line" icon="plus"/></li>
      <li><Button action={insertCommand} label="Insert Command" icon="newCommand"/></li>
      {#if index > 0}
        <li><Button action={() => nodes.branchFrom(nodeId, index)} label="Add Branch" icon="addBranch"/></li>
      {/if}
      {#if canLink}
        <li><Button action={linkTo} label="Link to node…" icon="link"/></li>
      {/if}
      <li><Button action={play} label="Play from Here" icon="play"/></li>
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
    background-color: var(--green-alpha-20);
    border-radius: 1em;
    top: -1em;
    left: -1em;
    right: -1em;
    bottom: 1em;
  }

  ul.actions {
    visibility: hidden;
    display: flex;
    padding: 1px 0;
  }

  ul.actions li {
    margin-right: 0.5rem;
  }

  div:hover ul.actions:not(.disabled) {
    visibility: visible;
  }
</style>
