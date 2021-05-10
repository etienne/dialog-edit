<script>
  import { dialogs, currentPreview } from './stores';
  import Button from './Button.svelte';
  import Node from './Node.svelte';

  let [dialogId, index] = $currentPreview;
  let node = $dialogs[dialogId].nodes[index];
</script>

<Button label="Close" action={() => currentPreview.set(null)}/>
<div>
  <Node node={node} dialogId={dialogId} index={index} preview/>
</div>

<style>
  div {
    margin: auto;
    max-width: 48em;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 2rem;
  }
</style>