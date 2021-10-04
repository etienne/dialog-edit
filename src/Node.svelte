<script>
  import { nodes, lastNodeWouldCauseInfiniteLoop, lastNodeLinksToChapterId, selectLinkFromNode, attachedNodes, selectedNode } from './stores/nodes';
  import Button from './Button.svelte';
  import BranchTabs from './BranchTabs.svelte';
  import Line from './Line.svelte';
  import LinkIndicator from './LinkIndicator.svelte';
  export let node, last = false, disabled = false, hideExtras = false;
  let linkedNodeUsageCount;

  if (node.linkTo) {
    linkedNodeUsageCount = $attachedNodes
      .map(n => ($nodes[n].branchTo || [])
      .concat([$nodes[n].linkTo]))
      .flat()
      .filter(n => !!n)
      .reduce((previous, current) => current == node.linkTo ? previous + 1 : previous, 0);
  }

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

  function selectNode() {
    $selectedNode = node.id;
  }
</script>

{#if node}
  <section on:click={selectNode} class:selected={$selectedNode == node.id} data-id={node.id}>
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
      <LinkIndicator node={node} count={linkedNodeUsageCount}/>
    {/if}
  {/if}
{/if}

<style>
  section {
    border: 1px solid var(--lighter-color);
    border-radius: 6px;
    box-shadow: 0 5px 35px 0 var(--lightest-color);
    padding: 0.5rem 2rem;
    margin: 1rem 0;
    position: relative;
  }

  section.selected {
    border-color: var(--light-color);
    box-shadow: 0 5px 35px 0 var(--lighter-color);
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
