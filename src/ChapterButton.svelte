<script>
  export let chapter;
  import { selectedChapterId } from './stores.js';
</script>

<button on:click={() => $selectedChapterId = chapter.id} class:selected={$selectedChapterId == chapter.id}>
  {chapter.name || 'untitled chapter'}
</button>

<style>
  button {
    width: 100%;
    text-align: left;
    display: block;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 0.6rem;
    cursor: pointer;
    background-color: transparent;
  }

  button:hover {
    background-color: var(--lighter-color);
  }

  button.selected {
    background-color: var(--light-color);
  }
</style>
