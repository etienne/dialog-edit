<script>
  import { chapters, nodes, nodeSequence, selectLinkFromNode, firstCharacterFieldElements } from './stores.js';
  import Node from './Node.svelte';
  import Field from './Field.svelte';
  export let chapter;

  let startNode;
  $: startNode = $nodes[chapter.firstNode];

  function updateChapter(newName) {
    const updatedChapter = { ...chapter, name: newName };
    chapters.update(updatedChapter);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      if (startNode) {
        const firstElement = $firstCharacterFieldElements[startNode.id];

        if (firstElement) {
          firstElement.focus();
        }
      }
      e.preventDefault();
    };
  }

  function touch() {
    chapters.touch(chapter.id);
  }

</script>

<section>
  <Field
    action={updateChapter}
    focusOnMount={chapter.newlyCreated}
    keyDown={onKeyDown}
    placeholder="untitled chapter"
    touch={touch}
    type="label"
    value={chapter.name}
    disabled={!!$selectLinkFromNode}
  />

  {#if startNode}
    {#each $nodeSequence as nodeId}
      <Node node={$nodes[nodeId]}/>
    {/each}
  {/if}
</section>
