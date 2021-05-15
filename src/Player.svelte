<script>
  import { dialogs, currentPreview } from './stores';
  import Button from './Button.svelte';
  import Line from './Line.svelte';

  let dialogId, index, line, dialog, isLastLine;
  $: [dialogId, index] = $currentPreview;
  $: dialog = $dialogs[dialogId];
  $: line = dialog.lines[index];
  $: isLastLine = index == dialog.lines.length - 1;

  function advance() {
    if (!isLastLine) {
      $currentPreview = [dialogId, index + 1];
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
    <Line line={line} dialogId={dialogId} index={index} preview/>
  </div>

  {#if isLastLine}
    {#if dialog.branchTo}
      <ul>
        {#each dialog.branchTo as branchTo}
          <li>
            <button on:click={() => pickBranch(branchTo)}>
              {$dialogs[branchTo].lines[0].text}
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p>(End of dialog)</p>
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
    border: 1px solid #ccc;
    border-radius: 5px;
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
    border: 1px solid #ccc;
    background: transparent;
    padding: 1rem 2rem;
    cursor: pointer;
  }

  button:hover {
    background-color: rgba(0,0,0,0.06);
  }

  p {
    text-align: center;
    color: #ccc;
  }
</style>