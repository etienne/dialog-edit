<script>
  import Button from './Button.svelte';
  import { linkPairs, nodes } from './stores';
  export let node;

  const nodeCount = $linkPairs[node.linkTo].length;
  const isPlural = nodeCount > 1;

  function removeLink() {
    nodes.removeLink(node.id);
  }
</script>

<section>
  <img src="/info.svg" alt="">
  <span>
    {nodeCount} link{isPlural ? 's' : ''} lead{isPlural ? '' : 's'} here
  </span>
  <div class="actions">
    <Button action={removeLink} icon="breakLink" label="Break link to the following node"/>
  </div>
</section>

<style>
  section {
    display: flex;
    background-color: var(--yellow-alpha-10);
    padding: 0.5em;
    border-radius: 8px;
    font-size: 0.75em;
  }

  span {
    padding: 0.2em 0;
  }

  img {
    margin: -0.2em 0.5em 0 0;
  }

  div.actions {
    display: flex;
    margin-left: auto;
  }
</style>
