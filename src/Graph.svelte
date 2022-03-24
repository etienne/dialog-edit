<script>
  import { tick } from 'svelte';
  import { nodes as nodesStore, graphNodes, nodeSequence, flaggedNodes } from './stores/nodes';
  import { currentlyEditedNodeId } from './stores/ui';
  import MiniNode from './MiniNode.svelte';

  let nodes, edges, rows, previewElement, showPreview, selectedNode;
  $: ({ nodes, edges, rows } = $graphNodes);

  let nodeWidth = 14, verticalMargin = 35, currentY;

  $: rows.forEach((row, rowIndex) => {
    if (rowIndex == 0) {
      currentY = 30;
    }
    let rowHeight = row.reduce((acc, id) => Math.max(getNodeHeight(id), acc), 0);
    row.forEach((id, itemIndex) => {
      nodes[id].x = ((itemIndex + 1) / (row.length + 1) * 100) + '%';
      nodes[id].yIn = currentY;
      nodes[id].yOut = currentY + getNodeHeight(id);
    })
    currentY = currentY + rowHeight + verticalMargin;
  })

  function getNodeHeight(id) {
    return Math.max(2 + ($nodesStore[id].lines.length * 2) + 1, 9);
  }

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
    previewElement.style.top = `${bounds.top + bounds.height + 10}px`;
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
          y1={nodes[edge.from].yOut}
          x2={nodes[edge.to].x}
          y2={nodes[edge.to].yIn}
        />
      {/each}
      {#each Object.keys(nodes) as id}
        <g data-id={id} on:click={handleClick} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
          <rect
            class="node"
            class:active={$nodeSequence.includes(Number(id))}
            class:editing={$currentlyEditedNodeId == Number(id)}
            class:flagged={$flaggedNodes.includes(Number(id))}
            x={nodes[id].x}
            y={nodes[id].yIn}
            rx=2
            ry=2
            width={nodeWidth}
            height={nodes[id].yOut - nodes[id].yIn}
            transform="translate(-{nodeWidth/2} 0)"
          />
          {#each $nodesStore[id].lines as l, index}
            <rect
              class="line"
              class:active={$nodeSequence.includes(Number(id))}
              class:command={l.type == 'command'}
              x={nodes[id].x}
              y={nodes[id].yIn + index * 2 + 2}
              width={nodeWidth - 4}
              height=1
              transform="translate(-{(nodeWidth - 4)/2} 0)"
            />
          {/each}
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

  rect.node {
    fill: white;
    stroke: var(--medium-color);
  }

  rect.node.active {
    stroke: var(--dark-color);
  }

  rect.node.active.flagged {
    stroke: var(--red-alpha-60);
  }

  rect.node.editing {
    fill: var(--lighter-color);
  }

  rect.node.flagged, g:hover rect.node.flagged {
    stroke: var(--red-alpha-30);
  }

  g:hover rect.node {
    stroke: var(--dark-color);
  }

  rect.line {
    fill: var(--dark-alpha-30);
  }

  rect.line.active {
    fill: var(--dark-alpha-40);
  }

  rect.line.command {
    fill: var(--yellow-alpha-40);
  }

  rect.line.command.active {
    fill: var(--yellow-alpha-60);
  }

  @media (min-width: 72em) {
    section {
      display: block;
    }    
  }
</style>
