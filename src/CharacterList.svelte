<script>
  import { getColorClass } from './stores/helpers';
  export let selectionIndex = null, characters = [], onCharacterSelect = () => {};

  function onMouseEnter(e) {
    selectionIndex = [...e.target.parentElement.children].indexOf(e.target);
  }

  function onMouseLeave(e) {
    selectionIndex = null;
  }

  function onClick() {
    onCharacterSelect(selectionIndex);
  }
</script>

<ul>
  {#each characters as character, index}
    <li class:selected={selectionIndex === index} on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave} on:mousedown={onClick} class={getColorClass(character)}>
      {character}
    </li>
  {/each}
</ul>

<style>
  ul {
    position: absolute;
    width: 42em;
    z-index: 1000;
    background-color: var(--bg-color);
    box-shadow: 0 5px 35px 0 var(--light-color);
    border-radius: 6px;
    margin-top: 2px;
    padding: 0.2em;
  }

  li {
    padding: 0.2em 1em;
    border-radius: 3px;
    cursor: pointer;
  }

  li.selected {
    background-color: var(--light-color);
  }
</style>
