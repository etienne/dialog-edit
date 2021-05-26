<script>
  import { nodes, currentPreview, playerHistory } from './stores';
  import Line from './Line.svelte';

  let nodeId, index, line, node, isLastLine;
  $: [nodeId, index] = $currentPreview;
  $: node = $nodes[nodeId];
  $: line = node.lines[index];
  $: isLastLine = index == node.lines.length - 1;

  function advance() {
    let next;
    if (!isLastLine) {
      next = [nodeId, index + 1];
      $currentPreview = next;
      $playerHistory.push(next);
    } else if (node.linkTo) {
      $currentPreview = [node.linkTo, 0];
      $playerHistory.push(next);
    }
  }

  function pickBranch(id) {
    $currentPreview = [id, 0];
  }
</script>

<svelte:body on:click|capture|self={advance}/>

<section>
  <div>
    <Line line={line} nodeId={nodeId} index={index} preview/>
  </div>

  {#if isLastLine && !node.linkTo}
    {#if node.branchTo}
      <ul>
        {#each node.branchTo as branchTo}
          <li>
            <button on:click={() => pickBranch(branchTo)}>
              {$nodes[branchTo].lines[0].text}
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p>(End of sequence)</p>
    {/if}
  {:else}
    <p>Click to continue</p>
  {/if}
</section>

<style>
  section {
    margin: 6em auto;
    max-width: 48em;
  }

  div {
    border: 1px solid var(--light-color);
    border-radius: 6px;
    box-shadow: 0 5px 35px 0 var(--light-color);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  li:first-child button {
    border-radius: 5px 5px 0 0;
  }

  li:last-child button {
    border-radius: 0 0 5px 5px;
  }

  button {
    width: 100%;
    margin-bottom: -1px;
    border: 1px solid var(--light-color);
    background-color: var(--bg-color);
    padding: 1rem 2rem;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--lighter-color);
  }

  p {
    text-align: center;
    color: #ccc;
  }
</style>