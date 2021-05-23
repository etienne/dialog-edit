<script>
  import { nodes, selectLinkFromNode } from './stores.js';
  import Button from './Button.svelte';
  import BranchTabs from './BranchTabs.svelte';
  import LinkIndicator from './LinkIndicator.svelte';
  import Line from './Line.svelte';
  export let node;
</script>

<section>
  <div class:empty={!(node.lines && node.lines.length)}>
    <ul class="actions" class:disabled={!!$selectLinkFromNode}>
      <li><Button action={() => nodes.prependLine(node.id)} label="Insert Line" icon="plus"/></li>
    </ul>
  </div>
  {#if node.lines && node.lines.length}
    <ul>
      {#each node.lines as line, index}
        <li><Line line={line} nodeId={node.id} index={index} disabled={!!$selectLinkFromNode}/></li>
      {/each}
    </ul>
  {/if}
  {#if node.branchTo && node.branchTo.length}
    <BranchTabs node={node}/>
  {:else if node.linkTo}
    <LinkIndicator node={node}/>
  {/if}
</section>

<style>
  ul.actions {
    display: flex;
    visibility: hidden;
  }

  div:hover ul.actions:not(.disabled), div.empty ul.actions:not(.disabled) {
    visibility: visible;
  }
</style>
