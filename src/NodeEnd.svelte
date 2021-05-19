<script>
  import { nodes } from './stores';
  import Button from './Button.svelte';
  export let node;

  function jumpTo() {

  }

  function addBranch() {
    nodes.branchFrom(node.id);
  }
</script>

<section>
  <span>End of node.</span>
  <div class="actions">
    <Button action={jumpTo} label="Jump to…" icon="link" block/>
    <Button action={addBranch} label="Add branch" icon="addBranch" block/>
  </div>
</section>

<style>
  section {
    display: flex;
    border: 1px solid var(--lighter-color);
    padding: 0.5em;
    border-radius: 8px;
    font-size: 0.75em;
    color: var(--medium-color);
  }

  span {
    padding: 0.2em 0.5em;
  }

  div {
    display: flex;
    margin-left: auto;
  }
</style>