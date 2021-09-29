<script>
  import { nodes, lastNodeWouldCauseInfiniteLoop, lastNodeLinksToChapterId, selectLinkFromNode, attachedNodes } from './stores/nodes';
  import Button from './Button.svelte';
  import BranchTabs from './BranchTabs.svelte';
  import Line from './Line.svelte';
  import LinkIndicator from './LinkIndicator.svelte';
  export let node, last = false, disabled = false, hideExtras = false;
  const usageCount = $attachedNodes
    .map(n => ($nodes[n].branchTo || [])
    .concat([$nodes[n].linkTo]))
    .flat()
    .filter(n => !!n)
    .reduce((previous, current) => current == node.id ? previous + 1 : previous, 0);

  function insertLine() {
    nodes.prependLine(node.id);
  }

  function insertCommand() {
    nodes.prependCommand(node.id);
  }

  function addBranch() {
    nodes.addBranch(node.id);
  }

  function linkTo(e) {
    $selectLinkFromNode = node.id;
    e.stopPropagation();
  }
</script>

{#if node}
  <section>
    {#if usageCount > 1}
      <aside><img src="/info.svg" alt=""/>This node is used {usageCount} times</aside>
    {/if}
    <div class:empty={!(node.lines && node.lines.length)}>
      <ul class="actions" class:disabled>
        <li><Button action={insertLine} label="Insert Line" icon="plus"/></li>
        <li><Button action={insertCommand} label="Insert Command" icon="newCommand"/></li>
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
    {#if !node.linkTo && !(node.branchTo && node.branchTo.length)}
      <span>
        <Button action={addBranch} label="Create New Branch" icon="addBranch"/>
        <Button action={linkTo} label="Link To Node…" icon="link"/>
      </span>
    {:else if last && $lastNodeWouldCauseInfiniteLoop}
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
    border: 1px solid var(--lighter-color);
    border-radius: 6px;
    box-shadow: 0 5px 35px 0 var(--lighter-color);
    padding: 0.5rem 2rem;
    margin: 1rem 0;
    position: relative;
  }

  aside {
    position: absolute;
    top: 0.4rem;
    right: 0.8rem;
    font-size: 0.75em;
    opacity: 0.4;
  }

  aside img {
    float: left;
    margin-right: 0.4rem;
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

  span {
    display: flex;
  }
</style>
