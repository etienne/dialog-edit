<script>
  import { graphNodes, nodeSequence } from './stores/nodes';

  function handleClick(e) {
    const id = e.target.parentNode.dataset.id;
    console.log(id);
  }

  let nodes, edges, rows;
  $: ({ nodes, edges, rows } = $graphNodes);

  $: rows.forEach((row, rowIndex) => {
    row.forEach((id, itemIndex) => {
      nodes[id].x = ((itemIndex + 1) / (row.length + 1) * 100) + '%';
      nodes[id].y = 50 + 50 * rowIndex;
    })
  })
</script>

<section>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
    {#each edges as edge}
      <line
        class:active={$nodeSequence.includes(Number(edge.from)) && $nodeSequence.includes(Number(edge.to))}
        x1={nodes[edge.from].x}
        x2={nodes[edge.to].x}
        y1={nodes[edge.from].y}
        y2={nodes[edge.to].y}
      />
    {/each}
    {#each Object.keys(nodes) as id}
      <g data-id={id} on:click={handleClick}>
        <circle
          class="background"
          cx={nodes[id].x}
          cy={nodes[id].y}
          r="12"
        />
        <circle
          class="foreground"
          class:active={$nodeSequence.includes(Number(id))}
          cx={nodes[id].x}
          cy={nodes[id].y}
          r="4"
        />
      </g>
    {/each}
  </svg>
</section>

<style>
  section {
    display: none;
    position: fixed;
    height: 90vh;
    right: 2em;
    width: calc(100% - 70em);
  }

  svg {
    width: 100%;
    height: 100%;
  }

  line {
    stroke: var(--lighter-color);
    stroke-width: 1;
  }

  line.active {
    stroke: var(--dark-color);
  }

  g {
    cursor: pointer;
  }

  circle.background {
    fill: transparent;
  }

  circle.foreground {
    fill: white;
    stroke: var(--medium-color);
  }

  circle.active {
    stroke: var(--dark-color);
  }

  g:hover circle.foreground {
    stroke: var(--dark-color);
  }

  @media (min-width: 80em) {
    section {
      display: block;
    }    
  }
</style>
