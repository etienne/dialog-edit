<script>
  import Button from './Button.svelte';
  import { selectLinkFromNode } from './stores/nodes';

  function cancel() {
    $selectLinkFromNode = null;
  }
</script>

<div>
  <span>Select a node or a line to link to it.</span>
  <Button label="Cancel" action={cancel}/>
</div>

<style>
  div {
    position: fixed;
    z-index: 1000;
    top: 2em;
    right: 2em;
    background-color: white;
    border: 1px solid var(--light-color);
    border-radius: 6px;
    box-shadow: 0 5px 35px 0 var(--light-color);
    padding: 2rem;
  }

  span {
    margin-right: 1em;
  }
</style>