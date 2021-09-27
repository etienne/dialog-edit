import { get, writable, derived } from 'svelte/store';
import { chapters, selectedChapter } from './chapters';
import { getNewId } from './helpers';

function createNodes() {
	const { subscribe, update, set } = writable(JSON.parse(localStorage.getItem('nodes')) || {});

	return {
		subscribe,
    set,

    add: () => update(n => {
      const newId = getNewId(Object.keys(n));
      n[newId] = {
        id: newId,
        lines: [{}],
      };
      return n;
    }),

    update: newNode => update(n => {
      return {...n, [newNode.id]: newNode };
    }),

    delete: deleteId => update(n => {
      Object.keys(n).forEach(id => {
        if (n[id].branchTo) {
          const updatedBranchTo = n[id].branchTo.filter(b => b !== deleteId);
          n[id] = {...n[id], branchTo: updatedBranchTo, selectedBranch: 0};
        }
      });
      delete n[deleteId];

      return n;
    }),

    deleteBranch: (nodeId, index) => update(n => {
      const parentNode = n[nodeId];
      parentNode.branchTo.splice(index, 1);
      if (parentNode.branchTo.length === 1) {
        // Only one branch remains after deletion; merge last branch back into parent node
        const lastBranchId = parentNode.branchTo[0];
        const mergedNode = { [nodeId]: merge(parentNode, n[lastBranchId]) };
        return {...n, ...mergedNode};
      } else {
        const newSelectedBranch = index - 1 >= 0 ? index - 1 : 0;
        const updatedNode = {...parentNode, selectedBranch: newSelectedBranch};
        return {...n, [nodeId]: updatedNode};
        }
    }),

    updateLine: (nodeId, index, newLine) => update(n => {
      const updatedLines = [...n[nodeId].lines];
      updatedLines[index] = newLine;
      const newNode = {...n[nodeId], lines: updatedLines};
      return {...n, [nodeId]: newNode};
    }),

    insertLineAfter: (nodeId, index) => update(n => {
      const updatedLines = [...n[nodeId].lines];
      let character;
      if (index > 0) {
        character = updatedLines[index - 1].character;
      }
      updatedLines.splice(index + 1, 0, {newlyCreated: true, character});
      const newNode = {...n[nodeId], lines: updatedLines};
      return {...n, [nodeId]: newNode};
    }),

    insertCommandAfter: (nodeId, index) => update(n => {
      const updatedLines = [...n[nodeId].lines];
      updatedLines.splice(index + 1, 0, {newlyCreated: true, type: 'command'});
      const newNode = {...n[nodeId], lines: updatedLines};
      return {...n, [nodeId]: newNode};
    }),

    branchFrom: (nodeId, index) => update(n => {
      const newId = getNewId(Object.keys(n));
      const newNode = {id: newId, lines: [{}]};
      const currentBranchIds = n[nodeId].branchTo || [];

      if (index) {
        const linesToKeep = [...n[nodeId].lines].slice(0, index);
        const linesToBranchOff = [...n[nodeId].lines].slice(index);
        const branchedId = getNewId([...Object.keys(n), newId]);
        const newBranchTo = [branchedId, newId];
        const updatedNode = {...n[nodeId], lines: linesToKeep, branchTo: newBranchTo, selectedBranch: newBranchTo.length - 1};
        const branchedNode = {id: branchedId, lines: linesToBranchOff, branchTo: currentBranchIds};
        const character = branchedNode.lines[0].character;
        newNode.lines = [{character}];
        return {...n, [nodeId]: updatedNode, [branchedId]: branchedNode, [newId]: newNode};
      } else {
        const newBranchTo = [...currentBranchIds, newId];
        const updatedNode = {...n[nodeId], branchTo: newBranchTo, selectedBranch: newBranchTo.length - 1};
        const character = n[currentBranchIds[0]].lines[0].character;
        newNode.lines = [{character}];
        return {...n, [nodeId]: updatedNode, [newId]: newNode};
      }
    }),

    link: (fromNodeId, toNodeId, toLineIndex) => update(n => {
      let updatedFromNode;
      if (toLineIndex === 0) {
        updatedFromNode = {...n[fromNodeId], linkTo: toNodeId};
        return {...n, [fromNodeId]: updatedFromNode};
      } else {
        // Target line is not the first of its node. We need to split the node first
        const newId = getNewId(Object.keys(n));
        let [updatedToNode, newToNode] = split(n[toNodeId], toLineIndex, newId);
        updatedFromNode = {...n[fromNodeId], linkTo: newToNode.id};
        updatedToNode.linkTo = newToNode.id;
        return {...n, [fromNodeId]: updatedFromNode, [toNodeId]: updatedToNode, [newId]: newToNode};
      }
    }),

    removeLink: (nodeId) => update(n => {
      const updatedNode = {...n[nodeId], linkTo: null};
      return {...n, [nodeId]: updatedNode};
    }),

    mergeNodes: (nodeId, targetNodeId) => update(n => {
      const updatedNode = merge(n[nodeId], n[targetNodeId]);
      return {...n, [nodeId]: updatedNode};
    }),

    selectBranch: (nodeId, index) => update(n => {
      const updatedNode = {...n[nodeId], selectedBranch: index };
      return {...n, [nodeId]: updatedNode};
    }),

    prependLine: nodeId => update(n => {
      const newLines = [...n[nodeId].lines];
      newLines.unshift({});
      const newNode = {...n[nodeId], lines: newLines};
      return {...n, [nodeId]: newNode};
    }),

    prependCommand: nodeId => update(n => {
      const newLines = [...n[nodeId].lines];
      newLines.unshift({type: 'command'});
      const newNode = {...n[nodeId], lines: newLines};
      return {...n, [nodeId]: newNode};
    }),

    deleteLine: (nodeId, index) => update(n => {
      const newLines = [...n[nodeId].lines];
      newLines.splice(index, 1);
      const newNode = {...n[nodeId], lines: newLines};
      return {...n, [nodeId]: newNode};
    }),
	};
}

export const nodes = createNodes();
nodes.subscribe(value => localStorage.nodes = JSON.stringify(value));

export const nodeSequence = derived([nodes, selectedChapter, chapters], ([$nodes, $selectedChapter, $chapters]) => {
  let nodeSequence = [];

  if ($selectedChapter) {
    const firstNodes = $chapters.map(c => c.firstNode);
    let currentNode = $nodes[$selectedChapter.firstNode];
    nodeSequence = [$selectedChapter.firstNode];
    lastNodeWouldCauseInfiniteLoop.set(false);
    lastNodeLinksToChapterId.set(false);
  
    while (currentNode && ((currentNode.branchTo && currentNode.branchTo.length) || currentNode.linkTo)) {
      if (currentNode.branchTo && currentNode.branchTo.length) {
        let selectedBranchIndex = currentNode.selectedBranch || 0;
        let nextNodeId = currentNode.branchTo[selectedBranchIndex];
        if (nodeSequence.indexOf(nextNodeId) !== -1) {
          lastNodeWouldCauseInfiniteLoop.set(true);
          break;
        } else {
          nodeSequence.push(nextNodeId);
          currentNode = $nodes[nextNodeId];
        }
      } else {
        let nextNodeId = currentNode.linkTo;
        if (nodeSequence.indexOf(nextNodeId) !== -1) {
          lastNodeWouldCauseInfiniteLoop.set(true);
          break;
        } else if (firstNodes.indexOf(nextNodeId) !== -1) {
          const chapterToLinkTo = $chapters.filter(c => c.firstNode == nextNodeId)[0];
          lastNodeLinksToChapterId.set(chapterToLinkTo.id);
          break;
        } else {
          nodeSequence.push(nextNodeId);
          currentNode = $nodes[nextNodeId];
        }
      }
    }
  }

  return nodeSequence;
});

export const linkPairs = derived(nodes, $nodes => {
  return getLinkPairs($nodes);
});

export const nextNodeId = derived(nodes, $nodes => {
  return getNewId(Object.keys($nodes));
});

export const characters = derived(nodes, $nodes => {
  let ids = Object.keys($nodes);
  let characters = [];
  ids.forEach(id => {
    if ($nodes[id].lines && $nodes[id].lines.length) {
      $nodes[id].lines.forEach(line => {
        if (line.character && characters.indexOf(line.character) === -1) {
          characters.push(line.character);
        }
      });
    }
  });
  return characters;
});

export const detachedNodes = derived([nodes, chapters], ([$nodes, $chapters]) => {
  let attachedNodes = $chapters.map(c => c.firstNode);
  let attachedCount;
  let safety = 0;

  while (attachedNodes.length !== attachedCount) {
    attachedCount = attachedNodes.length;
    attachedNodes.forEach(n => {
      if ($nodes[n].linkTo) {
        attachedNodes.push($nodes[n].linkTo)
      }

      if ($nodes[n].branchTo && $nodes[n].branchTo.length) {
        attachedNodes = attachedNodes.concat($nodes[n].branchTo);
      }
    });

    attachedNodes = [...new Set(attachedNodes)];

    if (safety++ > 10000) {
      console.error('Broke out of a possible infinite loop while calculating detached nodes');
      break;
    }
  }

  const allNodes = Object.keys($nodes).map(n => Number(n));
  const attachedNodesSet = new Set(attachedNodes);
  const detachedNodes = new Set(allNodes.filter(n => !attachedNodesSet.has(n)));

  return [...detachedNodes];
});

export const selectLinkFromNode = writable();
export const lastNodeWouldCauseInfiniteLoop = writable(false);
export const lastNodeLinksToChapterId = writable();

function getLinkPairs(nodes) {
  let ids = Object.keys(nodes);
  let linkPairs = {};
  ids.forEach(id => {
    let linkTo = nodes[id].linkTo;
    if (linkTo) {
      if (linkPairs[linkTo]) {
        linkPairs[linkTo].push(id);
      } else {
        linkPairs[linkTo] = [id];
      }
    }
  });
  return linkPairs;
}

function split(node, index, newId) {
  const linesToKeep = [...node.lines].slice(0, index);
  const linesToSplitOff = [...node.lines].slice(index);
  const updatedNode = {...node, lines: linesToKeep };
  delete updatedNode.branchTo;
  delete updatedNode.linkTo;
  delete updatedNode.selectedBranch;
  const newNode = {...node, lines: linesToSplitOff, id: newId};
  return [updatedNode, newNode];
}

function merge(node, targetNode) {
  const updatedLines = [...node.lines, ...targetNode.lines];
  return {...targetNode, id: node.id, lines: updatedLines};
}
