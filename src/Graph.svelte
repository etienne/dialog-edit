<script>
  import { graphNodes, nodeSequence } from './stores/nodes';
  import MiniNode from './MiniNode.svelte';

  let nodes, edges, rows, previewElement, showPreview, selectedNode;
  $: ({ nodes, edges, rows } = $graphNodes);

  $: rows.forEach((row, rowIndex) => {
    row.forEach((id, itemIndex) => {
      nodes[id].x = ((itemIndex + 1) / (row.length + 1) * 100) + '%';
      nodes[id].y = 50 + 50 * rowIndex;
    })
  })

  function handleClick(e) {
    const id = Number(e.target.parentNode.dataset.id);
    if ($nodeSequence.includes(id)) {
      const element = document.querySelector(`section[data-id="${id}"]`);
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('no');
    }
  }

  function handleMouseEnter(e) {
    const element = e.target;
    const bounds = element.getBoundingClientRect();
    previewElement.style.top = `${bounds.top + bounds.height}px`;
    previewElement.style.left = `${bounds.left - (bounds.width / 2)}px`;
    selectedNode = e.target.dataset.id;
    showPreview = true;
  }

  function handleMouseLeave(e) {
    showPreview = false;
  }
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
      <g data-id={id} on:click={handleClick} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
        <circle
          class="background"
          cx={nodes[id].x}
          cy={nodes[id].y}
          r="22"
        />
        <circle
          class="foreground"
          class:active={$nodeSequence.includes(Number(id))}
          cx={nodes[id].x}
          cy={nodes[id].y}
          r="3"
        />
      </g>
    {/each}
  </svg>
</section>

<div bind:this={previewElement} class:visible={showPreview}>
  <MiniNode id={selectedNode}/>
</div>

<style>
  section {
    display: none;
    position: fixed;
    height: 90vh;
    right: 2em;
    width: calc(100% - 70em);
    max-width: 16em;
  }

  div {
    background-color: var(--bg-color);
    border-radius: 5px;
    display: none;
    position: fixed;
    border: 1px solid var(--light-color);
    box-shadow: 0 5px 35px 0 var(--light-color);
  }

  div.visible {
    display: block;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  line {
    stroke: var(--medium-alpha-30);
    stroke-width: 1;
  }

  line.active {
    stroke: var(--medium-color);
  }

  g {
    cursor: pointer;
  }

  circle.background {
    fill: transparent;
  }

  circle.foreground {
    transition: r 0.15s;
    fill: white;
    stroke: var(--medium-color);
  }

  circle.active {
    stroke: var(--dark-color);
  }

  g:hover circle.foreground {
    stroke: var(--dark-color);
    r: 7;
  }

  @media (min-width: 80em) {
    section {
      display: block;
    }    
  }
</style>
