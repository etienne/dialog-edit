<script>
  import { nodes, currentPreview } from './stores';
  import Button from './Button.svelte';
  import Line from './Line.svelte';

  let nodeId, index, line, node, isLastLine;
  $: [nodeId, index] = $currentPreview;
  $: node = $nodes[nodeId];
  $: line = node.lines[index];
  $: isLastLine = index == node.lines.length - 1;

  function advance() {
    if (!isLastLine) {
      $currentPreview = [nodeId, index + 1];
    }
  }

  function pickBranch(id) {
    $currentPreview = [id, 0];
  }
</script>

<svelte:body
	on:click|capture|self={advance}
/>

<nav>
  <Button label="Close" icon="chevronLeft" large action={() => currentPreview.set(null)}/>
</nav>

<section>
  <div>
    <Line line={line} nodeId={nodeId} index={index} preview/>
  </div>

  {#if isLastLine}
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
  nav {
    position: absolute;
    top: 2em;
    left: 2em;
  }

  section {
    margin: 6em auto;
    max-width: 48em;
  }

  div {
    background-color: var(--lighter-color);
    border-radius: 6px;
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
    border: 1px solid var(--medium-color);
    background: transparent;
    padding: 1rem 2rem;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--light-color);
  }

  p {
    text-align: center;
    color: #ccc;
  }
</style>