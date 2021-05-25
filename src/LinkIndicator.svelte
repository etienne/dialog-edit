<script>
  import Button from './Button.svelte';
  import { linkPairs, nodes } from './stores';
  export let node, loop = false;

  const nodeCount = $linkPairs[node.linkTo].length;
  const isPlural = nodeCount > 1;

  function removeLink() {
    nodes.removeLink(node.id);
  }
</script>

<section class:loop>
  <img src="/info.svg" alt="">
  <span>
    {#if loop}
      A link was hidden because it would create an infinite loop.
    {:else}
      This is a link. The content below is shared between several nodes.
    {/if}
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

  section.loop {
    background-color: var(--red-alpha-10);
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
