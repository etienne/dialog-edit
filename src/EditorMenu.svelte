<script>
  import Button from './Button.svelte';
  import Menu from './Menu.svelte';
  import { chapters, selectedChapterId } from './stores.js';

  function addChapter() {
    chapters.add();
  }

  function deleteChapter() {
    chapters.delete($selectedChapterId);
  }
</script>

<Menu>
  <ul>
    <li><Button action={addChapter} label="New Chapter" icon="plus"/></li>
    {#if $chapters.length}
      <li><Button action={deleteChapter} label="Delete Chapter" icon="trash"/></li>
    {/if}
  </ul>
</Menu>

<style>
  ul {
    display: flex;
  }

  ul li {
    margin-right: 0.5rem;
  }
</style>
