<script>
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action'
  import { detachedNodes } from './stores/nodes';
  import { chapters, selectedChapterId, showDetachedNodes } from './stores/chapters';
  const flipDurationMs = 200;
  const dropTargetStyle = {};
  let items;
  $: items = $chapters;

  function handleDndConsider(e) {
		items = e.detail.items;
	}

  function handleDndFinalize(e) {
		$chapters = items = e.detail.items;
	}

  function selectChapter(chapter) {
    return () => {
      window.scrollTo(0, 0);
      $selectedChapterId = chapter.id;
      $showDetachedNodes = false;
    };
  }

  function selectDetachedNodes() {
    $showDetachedNodes = true;
    $selectedChapterId = null;
  }
</script>

<div>
  {#if items.length}
    <ul use:dndzone={{items, flipDurationMs, dropTargetStyle}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
      {#each items as chapter(chapter.id)}
        <li animate:flip={{duration: flipDurationMs}} on:click={selectChapter(chapter)} class:selected={$selectedChapterId == chapter.id}>
          {chapter.name || 'untitled chapter'}
        </li>
      {/each}
    </ul>
  {/if}
  {#if $detachedNodes.length}
    <ul class="detached">
      <li on:click={selectDetachedNodes} class:selected={$showDetachedNodes}>Detached Nodes</li>
    </ul>
  {/if}
</div>

<style>
  div {
    position: fixed;
    width: 30%;
    max-width: 18rem;
  }

  ul {
    margin-bottom: 0.5rem;
  }

  ul.detached {
    border-top: 1px solid #eee;
    padding-top: 0.5rem;
  }

  ul li {
    box-sizing: border-box;
    width: 100%;
    text-align: left;
    display: block;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 0.6rem;
    cursor: pointer;
    background-color: transparent;
  }

  ul li:hover {
    background-color: var(--lighter-color);
  }

  ul li.selected {
    background-color: var(--light-color);
  }
</style>
