<script>
  import { nodes, lastNodeWouldCauseInfiniteLoop, lastNodeLinksToChapterId } from './stores/nodes';
  import Button from './Button.svelte';
  import BranchTabs from './BranchTabs.svelte';
  import Line from './Line.svelte';
  import LinkIndicator from './LinkIndicator.svelte';
  export let node, last = false, disabled = false, hideExtras = false;
</script>

{#if node}
  <section>
    <div class:empty={!(node.lines && node.lines.length)}>
      <ul class="actions" class:disabled>
        <li><Button action={() => nodes.prependLine(node.id)} label="Insert Line" icon="plus"/></li>
        <li><Button action={() => nodes.prependCommand(node.id)} label="Insert Command" icon="newCommand"/></li>
      </ul>
    </div>
    {#if node.lines && node.lines.length}
      <ul>
        {#each node.lines as line, index}
          <li><Line line={line} nodeId={node.id} index={index} {disabled}/></li>
        {/each}
      </ul>
    {/if}
  </section>
  {#if !hideExtras}
    {#if last && $lastNodeWouldCauseInfiniteLoop}
      <LinkIndicator node={node} loop/>
    {:else if last && $lastNodeLinksToChapterId}
      <LinkIndicator node={node} linkToChapterId={$lastNodeLinksToChapterId}/>
    {:else if node.branchTo && node.branchTo.length}
      <BranchTabs node={node}/>
    {:else if node.linkTo}
      <LinkIndicator node={node}/>
    {/if}
  {/if}
{/if}

<style>
  section {
    border: 1px solid #eee;
    padding: 0.1rem 1rem;
    border-radius: 6px;
    margin: 1rem 0;
  }

  ul.actions {
    display: flex;
    visibility: hidden;
  }

  ul.actions li {
    margin-right: 0.5rem;
  }

  div:hover ul.actions:not(.disabled), div.empty ul.actions:not(.disabled) {
    visibility: visible;
  }
</style>
