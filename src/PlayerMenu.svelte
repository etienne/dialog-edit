<script>
  import Button from './Button.svelte';
  import Menu from './Menu.svelte';
  import { currentPreview, playerHistory } from './stores/player';

  let currentHistoryIndex, disableBack, disableForward;
  $: currentHistoryIndex = $playerHistory.indexOf($currentPreview);
  $: disableBack = currentHistoryIndex <= 0;
  $: disableForward = currentHistoryIndex >= $playerHistory.length - 1;

  function back() {
    $currentPreview = $playerHistory[currentHistoryIndex - 1];
  }

  function forward() {
    $currentPreview = $playerHistory[currentHistoryIndex + 1];
  }
</script>

<Menu>
  <ul>
    <li><Button label="Back" large disabled={disableBack} icon="chevronLeft" action={back}/></li>
    <li><Button label="Forward" large disabled={disableForward} icon="chevronRight" action={forward}/></li>
    <li class="exit"><Button label="Exit Player" large icon="x" action={() => currentPreview.set(null)}/></li>
  </ul>
</Menu>

<style>
  ul {
    display: flex;
  }

  ul li {
    margin-right: 0.5rem;
  }

  li.exit {
    margin-left: auto;
  }
</style>
