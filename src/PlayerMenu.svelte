<script>
  import Button from './Button.svelte';
  import Menu from './Menu.svelte';
  import { currentPreview } from './stores';
</script>

<Menu>
  <ul>
    <li><Button label="Close" icon="x" action={() => currentPreview.set(null)}/></li>
  </ul>
</Menu>

<style>
  ul {
    display: flex;
  }

  ul li {
    margin-right: 0.5rem;
  }

  li {
    margin-left: auto;
  }
</style>
