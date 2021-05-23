<script>
  import Button from './Button.svelte';
  import ChapterButton from './ChapterButton.svelte';
  import { chapters, selectedChapterId } from './stores.js';

  function addChapter() {
    chapters.add();
  }

  function deleteChapter() {
    chapters.delete($selectedChapterId);
  }
</script>

<aside>
  {#if $chapters.length}
  <ul>
      {#each $chapters as chapter}
        <li>
          <ChapterButton chapter={chapter}/>
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

  ul.actions {
    display: flex;
  }

  ul.actions li {
    margin-right: 0.5rem;
  }
</style>
