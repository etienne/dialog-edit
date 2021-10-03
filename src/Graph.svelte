<script>
  import { Network } from "vis-network/standalone";
  import { onMount } from 'svelte';
  import { graphNodes } from './stores/nodes';

  let network;
  $: if (network) {
    network.setData($graphNodes);
  }

  onMount(async () => {
    const container = document.getElementById('network');
    const options = {
      nodes: {
        color: {
          border: '#DFE5E9',
          background: '#fff',
          hover: {
            background: '#DFE5E9',
          }
        },
        shape: 'dot',
        size: 10,
      },
      edges: {
        hoverWidth: 0,
        color: {
          hover: '#DFE5E9',
        },
      },
      groups: {
        active: {
          color: {
            border: '#9CABB3',
          },
        },
        selected: {
          color: {
            background: '#D0D9DE',
            border: '#9CABB3',
          },
        },
      },
      layout: {
        hierarchical: {
          direction: 'UD',
          sortMethod: 'directed',
          shakeTowards: 'roots',
        },
      },
      interaction: {
        dragNodes: false,
        dragView: false,
        hover: true,
        hoverConnectedEdges: false,
        selectable: false,
        zoomView: false,
      },
    };
    network = new Network(container, $graphNodes, options);
	});
</script>

<section id="network">
</section>

<style>
  section {
    display: none;
    position: fixed;
    height: 90vh;
    right: 2em;
    width: calc(100% - 70em);
  }

  @media (min-width: 80em) {
    section {
      display: block;
    }    
  }
</style>
