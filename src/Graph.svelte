<script>
  import { tick } from 'svelte';
  import { nodes as nodesStore, graphNodes, nodeSequence, flaggedNodes } from './stores/nodes';
  import { currentlyEditedNodeId } from './stores/ui';
  import MiniNode from './MiniNode.svelte';

  let nodes, edges, rows, previewElement, showPreview, selectedNode;
  $: ({ nodes, edges, rows } = $graphNodes);

  $: rows.forEach((row, rowIndex) => {
    row.forEach((id, itemIndex) => {
      nodes[id].x = ((itemIndex + 1) / (row.length + 1) * 100) + '%';
      nodes[id].y = 50 + 50 * rowIndex;
    })
  })

  async function handleClick(e) {
    const id = Number(e.target.parentNode.dataset.id);

    let currentId = id;
    let parentId, index, filteredEdges;
    let safety = 0;

    $currentlyEditedNodeId = currentId;

    while (!$nodeSequence.includes(id)) {
      filteredEdges = edges.filter(e => e.to == currentId);

      if (filteredEdges.length) {
        parentId = filteredEdges[0].from;
        if ($nodesStore[parentId].branchTo) {
          $nodesStore[parentId].branchTo.forEach((b, i) => {
            if (b == currentId) {
              index = i;
            }
          })
          if (index !== -1) {
            nodesStore.selectBranch(parentId, index);
          }
        }
        currentId = parentId;
        parentId = null;
        index = null;
      } else {
        console.error('Edge not found where `to` =', currentId);
        console.log(edges);
        break;
      }

      if (safety++ > 10000) {
        console.error('Broke out of a possible infinite loop while finding path to node');
        break;
      }
    }

    await tick();
    const element = document.querySelector(`section[data-id="${id}"]`);
    const headerOffset = 116;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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

{#if edges.length }
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
            class:editing={$currentlyEditedNodeId == Number(id)}
            class:flagged={$flaggedNodes.includes(Number(id))}
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
{/if}

<style>
  section {
    display: none;
    position: fixed;
    height: 90vh;
    right: 0;
    width: calc(100% - 66em);
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

  circle.editing {
    fill: var(--medium-color);
  }

  circle.flagged, g:hover circle.foreground.flagged {
    stroke: var(--red-alpha-60);
  }

  g:hover circle.foreground {
    stroke: var(--dark-color);
    r: 5;
  }

  @media (min-width: 72em) {
    section {
      display: block;
    }    
  }
</style>
