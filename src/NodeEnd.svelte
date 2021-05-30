<script>
  import { selectLinkFromNode } from './stores/nodes';
  import Button from './Button.svelte';
  export let node;

  function linkTo(e) {
    $selectLinkFromNode = node.id;
  }
</script>

<section>
  <span>End of node.</span>
  <div class="actions">
    <Button action={linkTo} label="Link to…" icon="link" block/>
  </div>
</section>

<style>
  section {
    display: flex;
    border-top: 1px solid var(--lighter-color);
    padding-top: 0.5em;
    font-size: 0.75em;
    color: var(--medium-color);
  }

  span {
    padding: 0.2em 0.5em;
  }

  div {
    display: flex;
    margin-left: auto;
  }
</style>