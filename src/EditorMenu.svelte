<script>
  import Button from './Button.svelte';
  import Menu from './Menu.svelte';
  import { chapters, selectedChapter, currentPreview } from './stores.js';
  let firstNode;

  $: if ($selectedChapter && $selectedChapter.firstNode) {
    firstNode = $selectedChapter.firstNode;
  }

  function addChapter() {
    chapters.add();
  }

  function deleteChapter() {
    chapters.delete($selectedChapter.id);
  }

  function play() {
    $currentPreview = [firstNode, 0];
  }
</script>

<Menu>
  <ul>
    <li><Button action={addChapter} label="New Chapter" icon="plus"/></li>
    {#if $chapters.length}
      <li><Button action={deleteChapter} label="Delete Chapter" icon="trash"/></li>
    {/if}
    {#if firstNode}
      <li class="play"><Button action={play} label="Play" icon="play"/></li>
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

  li.play {
    margin-left: auto;
  }
</style>
