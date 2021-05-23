<script>
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action'
  import Button from './Button.svelte';
  import { chapters, selectedChapterId } from './stores.js';
  const flipDurationMs = 200;
  const dropTargetStyle = {};

  function addChapter() {
    chapters.add();
  }

  function deleteChapter() {
    chapters.delete($selectedChapterId);
  }

  function handleDndConsider(e) {
		$chapters = e.detail.items;
	}

  function handleDndFinalize(e) {
		$chapters = e.detail.items;
	}

  function selectChapter(chapter) {
    return () => $selectedChapterId = chapter.id;
  }
</script>

<aside>
  {#if $chapters.length}
    <ul class="chapters" use:dndzone={{items: $chapters, flipDurationMs, dropTargetStyle}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
      {#each $chapters as chapter(chapter.id)}
        <li animate:flip={{duration: flipDurationMs}} on:click={selectChapter(chapter)} class:selected={$selectedChapterId == chapter.id}>
          {chapter.name || 'untitled chapter'}
        </li>
      {/each}
    </ul>
  {/if}
  
  <ul class="actions">
    <li><Button action={addChapter} label="New Chapter" icon="plus"/></li>
    {#if $chapters.length}
      <li><Button action={deleteChapter} label="Delete Chapter" icon="trash"/></li>
    {/if}
  </ul>
</aside>

<style>
  ul {
    margin-bottom: 2rem;
  }

  ul.chapters li {
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

  ul.chapters li:hover {
    background-color: var(--lighter-color);
  }

  ul.chapters li.selected {
    background-color: var(--light-color);
  }

  ul.actions {
    display: flex;
  }

  ul.actions li {
    margin-right: 0.5rem;
  }
</style>
