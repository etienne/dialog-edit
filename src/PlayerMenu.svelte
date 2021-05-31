<script>
  import Button from './Button.svelte';
  import Menu from './Menu.svelte';
  import { playerHistory, currentPlayerIndex, allowBack, allowForward } from './stores/player';

  function back() {
    currentPlayerIndex.back();
  }

  function forward() {
    currentPlayerIndex.forward();
  }

  function exit() {
    playerHistory.reset();
  }
</script>

<Menu>
  <ul>
    <li><Button label="Back" large disabled={!$allowBack} icon="chevronLeft" action={back}/></li>
    <li><Button label="Forward" large disabled={!$allowForward} icon="chevronRight" action={forward}/></li>
    <li class="exit"><Button label="Exit Player" large icon="x" action={exit}/></li>
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
