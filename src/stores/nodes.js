import { writable, derived } from 'svelte/store';
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
      const newSelectedBranch = index - 1 >= 0 ? index - 1 : 0;
      const updatedNode = {...parentNode, selectedBranch: newSelectedBranch};
      return {...n, [nodeId]: updatedNode};
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

    addBranch: (nodeId) => update(n => {
      const newId = getNewId(Object.keys(n));
      const newNode = {id: newId, lines: [{}]};
      const updatedNode = {...n[nodeId], branchTo: [newId]};
      return {...n, [nodeId]: updatedNode, [newId]: newNode};
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
        const updatedNode = {...n[nodeId], lines: linesToKeep, branchTo: newBranchTo, selectedBranch: 1};
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
  characters.sort();
  return characters;
});

export const attachedNodes = derived([nodes, chapters], ([$nodes, $chapters]) => {
  let attachedNodes = $chapters.map(c => c.firstNode);
  let attachedCount;
  let safety = 0;

  while (attachedNodes.length !== attachedCount) {
    attachedCount = attachedNodes.length;
    attachedNodes.forEach(n => {
      if ($nodes[n]) {
        if ($nodes[n].linkTo) {
          attachedNodes.push($nodes[n].linkTo)
        }
  
        if ($nodes[n].branchTo && $nodes[n].branchTo.length) {
          attachedNodes = attachedNodes.concat($nodes[n].branchTo);
        }
      }
    });

    attachedNodes = [...new Set(attachedNodes)];

    if (safety++ > 10000) {
      console.error('Broke out of a possible infinite loop while calculating attached nodes');
      break;
    }
  }

  return attachedNodes;
});

export const detachedNodes = derived([attachedNodes, nodes], ([$attachedNodes, $nodes]) => {
  const allNodes = Object.keys($nodes).map(n => Number(n));
  const attachedNodes = new Set($attachedNodes);
  const detachedNodes = new Set(allNodes.filter(n => !attachedNodes.has(n)));

  return [...detachedNodes];
});

export const lastNodeLinksToChapterId = writable();

export const graphNodes = derived([nodes, chapters, selectedChapter], ([$nodes, $chapters, $selectedChapter]) => {
  if (!$selectedChapter) {
    return {};
  }

  // Calculate nodes
  let nodeMap = { [$selectedChapter.firstNode]: undefined };
  let safety = 0;

  while (Object.values(nodeMap).flat().indexOf(undefined) >= 0) {
    Object.keys(nodeMap).forEach(id => {
      if ($selectedChapter.firstNode == id || !$chapters.filter(c => c.firstNode == id).length) {
        let attachedNodeIds = getAttachedNodeIds($nodes[id]);
        attachedNodeIds = attachedNodeIds.filter(attachedId => !$chapters.filter(c => c.firstNode == attachedId).length);
        attachedNodeIds.forEach(attachedId => {
          if (!nodeMap[attachedId]) {
            nodeMap[attachedId] = undefined;
          }
        });
        nodeMap[id] = attachedNodeIds;
      }
    });

    if (safety++ > 1000) {
      console.error('Broke out of a possible infinite loop while calculating graph nodes');
      break;
    }
  }
  const nodeIds = Object.keys(nodeMap);

  // Calculate edges
  let edges = [];
  nodeIds.forEach(from => {
    nodeMap[from].forEach(to => {
      edges.push({ from, to: to.toString() })
    });
  });

  // Calculate levels
  let nodes = {[$selectedChapter.firstNode]: { level: 0 }};
  safety = 0;

  while (Object.keys(nodes).length != nodeIds.length) {
    Object.keys(nodes).forEach(id => {
      edges.forEach(e => {
        if (e.from == id) {
          if (nodes[e.from].level >= 0) {
            if (!nodes[e.to]) {
              nodes[e.to] = { level: nodes[e.from].level + 1 };
            }
          }
        }

        if (e.to == id) {
          if (nodes[e.from].level >= nodes[e.to].level) {
            nodes[e.to] = { level: nodes[e.from].level + 1 };
          }
        }
      });
    })

    if (safety++ > 1000) {
      console.error('Broke out of a possible infinite loop while calculating graph node levels');
      break;
    }
  }

  let rows = [];

  nodeIds.forEach(id => {
    if (rows[nodes[id].level]) {
      rows[nodes[id].level].push(id);
    } else {
      rows[nodes[id].level] = [id];
    }
  });

  return { nodes, edges, rows };
});

export const flaggedNodes = derived(nodes, $nodes => {
  return Object.keys($nodes).map(id => Number(id)).filter(n => $nodes[n].lines.map(l => l.text).join().indexOf('TODO') >= 0);
});

export const selectLinkFromNode = writable();
export const lastNodeWouldCauseInfiniteLoop = writable(false);

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

function getAttachedNodeIds(node) {
  let nodeIds = [];

  if (node.linkTo) {
    nodeIds.push(node.linkTo)
  }

  if (node.branchTo && node.branchTo.length) {
    nodeIds = nodeIds.concat(node.branchTo);
  }

  return nodeIds;
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
