<script>
  import { detachedNodes, nodes } from './stores/nodes';
  import Button from './Button.svelte';
  import Node from './Node.svelte';
</script>

<section>
  <h1>Detached Nodes</h1>

  {#each $detachedNodes as nodeId}
  <article>
    <Node node={$nodes[nodeId]} disabled hideExtras/>
    <div class="actions">
      <Button action={() => nodes.delete(nodeId)} label="Delete Node" icon="trash"/>
    </div>
  </article>
  {/each}
</section>

<style>
  h1 {
    font-size: 2em;
    line-height: 1.3;
    margin: 0.4em 0 1rem;
    font-weight: normal;
  }

  article {
    position: relative;
  }

  div {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
</style>
