<script>
  import { nodes } from './stores/nodes';
  import { getColorClass } from './stores/helpers';
  export let id;

  let node;
  $: node = $nodes[id];
</script>

<section>
  {#if node && node.lines && node.lines.length}
    <ul>
      {#each node.lines.slice(0, 3) as line}
        <li class:command={line.type == 'command'}>
          {#if line.character}
            <div class:character={true} class={getColorClass(line.character)}>{line.character}</div>
          {/if}
          <div>{line.text}</div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  section {
    padding: 0.5rem;
    font-size: 0.7em;
    line-height: 1.3em;
    max-width: 10em;
    max-height: 8em;
    overflow: hidden;
  }

  li + li {
    margin-top: 0.5rem;
  }

  li.command {
    border-radius: 3px;
    padding: 0.2rem 0.4rem;
    background-color: var(--yellow-alpha-10);
  }

  div.character {
    font-size: 0.9em;
    text-transform: uppercase;
  }
</style>