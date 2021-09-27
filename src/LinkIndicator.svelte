<script>
  import Button from './Button.svelte';
  import { nodes } from './stores/nodes';
  import { chapters, selectedChapterId } from './stores/chapters';
  export let node, loop = false, linkToChapterId = null;
  let image, linkToChapter;
  $: image = loop ? '/warning.svg' : '/link.svg';

  if (linkToChapterId) {
    linkToChapter = $chapters.filter(c => c.id === linkToChapterId)[0];
  }

  function merge() {
    nodes.mergeNodes(node.id, node.linkTo);
  }

  function removeLink() {
    nodes.removeLink(node.id);
  }

  function handleLinkToChapter() {
    $selectedChapterId = linkToChapter.id;
    window.scrollTo(0, 0);
  }
</script>

<section class:loop>
  <img src={image} alt="">
  <span>
    {#if loop}
      A link was hidden because it would create an infinite loop.
    {:else if linkToChapter}
      This is a link to
      <span class="link" on:click={handleLinkToChapter}>
        {linkToChapter.name}
      </span>
    {:else}
      This is a link. The content below is shared between several nodes.
    {/if}
  </span>
  <div class="actions">
    {#if !loop && !linkToChapter}
      <Button action={merge} icon="merge" label="Merge Nodes"/>
    {/if}
    <Button action={removeLink} icon="breakLink" label="Break Link"/>
  </div>
</section>

<style>
  section {
    display: flex;
    background-color: var(--lightest-color);
    padding: 0.5em;
    border-radius: 8px;
    font-size: 0.75em;
  }

  section.loop {
    background-color: var(--red-alpha-10);
  }

  span {
    padding: 0.2em 0;
  }

  span.link {
    color: var(--blue);
    text-decoration: underline;
    cursor: pointer;
  }

  span.link:hover {
    color: var(--light-blue);
  }

  img {
    margin: -0.2em 0.5em 0 0;
  }

  div.actions {
    display: flex;
    margin-left: auto;
  }
</style>
