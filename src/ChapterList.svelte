<script>
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action'
  import { chapters, selectedChapterId } from './stores/chapters';
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
    };
  }
</script>

<aside>
  {#if items.length}
    <ul class="chapters" use:dndzone={{items, flipDurationMs, dropTargetStyle}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
      {#each items as chapter(chapter.id)}
        <li animate:flip={{duration: flipDurationMs}} on:click={selectChapter(chapter)} class:selected={$selectedChapterId == chapter.id}>
          {chapter.name || 'untitled chapter'}
        </li>
      {/each}
    </ul>
  {/if}
</aside>

<style>
  ul {
    margin-bottom: 2rem;
    position: fixed;
    width: 24%;
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
</style>
