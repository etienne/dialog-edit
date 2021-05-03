<script>
  import { dialogs } from './stores.js';
  import Field from './Field.svelte';
  export let node = {}, dialogId, index;

  function characterAction(newCharacter) {
    dialogs.updateNode(dialogId, index, {...node, character: newCharacter});
  }

  function textAction(newText) {
    dialogs.updateNode(dialogId, index, {...node, text: newText});
  }
</script>

<Field value={node.character} action={characterAction} placeholder="Character"/>
<Field value={node.text} action={textAction} type="autoresize" placeholder="Text"/>
