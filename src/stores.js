import { get, writable, derived } from 'svelte/store';

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

    branchFrom: (nodeId, index) => update(n => {
      const newId = getNewId(Object.keys(n));
      const newNode = {id: newId, lines: [{}]};
      const currentBranchIds = n[nodeId].branchTo || [];

      if (index) {
        const linesToKeep = [...n[nodeId].lines].slice(0, index);
        const linesToBranchOff = [...n[nodeId].lines].slice(index);
        const branchedId = getNewId([...Object.keys(n), newId]);
        const newBranchTo = [...currentBranchIds, branchedId, newId];
        const updatedNode = {...n[nodeId], lines: linesToKeep, branchTo: newBranchTo, selectedBranch: newBranchTo.length - 1};
        const branchedNode = {id: branchedId, lines: linesToBranchOff};
        return {...n, [nodeId]: updatedNode, [branchedId]: branchedNode, [newId]: newNode};
      } else {
        const newBranchTo = [...currentBranchIds, newId];
        const updatedNode = {...n[nodeId], branchTo: newBranchTo, selectedBranch: newBranchTo.length - 1};
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
      const linkTo = n[nodeId].linkTo;
      const updatedNode = {...n[nodeId], linkTo: null};
      const linkPairs = getLinkPairs(n);
      const firstNodes = get(chapters).map(c => c.firstNode);
      const isLinkToFirstNodeOfChapter = firstNodes.indexOf(linkTo) !== -1;
      const ids = Object.keys(n);
      const isLinkToBranch = ids.map(id => n[id].branchTo).flat().filter(id => !!id).indexOf(linkTo) !== -1;

      let mergedNode = {};
      if (linkPairs[linkTo].length === 2 && !isLinkToFirstNodeOfChapter && !isLinkToBranch) {
        // Only one link pair will exist after deletion. We need to merge the remaining nodes
        linkPairs[linkTo].forEach(j => {
          if (j != nodeId) {
            mergedNode = { [j]: merge(n[j], n[linkTo]) };
            delete n[linkTo];
          }
        });
      }
      return {...n, [nodeId]: updatedNode, ...mergedNode};
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

function createChapters() {
  const { subscribe, update, set } = writable(JSON.parse(localStorage.getItem('chapters')) || []);

  return {
    subscribe,
    set,

    add: () => update(c => {
      const ids = c.map(chapter => chapter.id);
      const newId = getNewId(ids);
      c.push({
        id: newId,
        name: '',
        newlyCreated: true,
        firstNode: get(nextNodeId),
      });
      selectedChapterId.set(newId);
      nodes.add();
      return c;
    }),

    update: (updatedChapter) => update(c => {
      c = c.map(chapter => chapter.id == updatedChapter.id ? updatedChapter : chapter)
      return c;
    }),

    touch: chapterId => update(c => {
      c = c.map(chapter => chapter.id == chapterId ? {...chapter, newlyCreated: false} : chapter);
      return c;
    }),

    delete: deleteId => update(c => {
      const ids = c.map(chapter => chapter.id);
      const index = ids.indexOf(deleteId);
      if (index >= 0) {
        c.splice(index, 1);
        if (c.length) {
          if (index == 0) {
            selectedChapterId.set(c[0].id);
          } else {
            selectedChapterId.set(c[index - 1].id);
          }
        } else {
          selectedChapterId.set(null);
        }
        return c;
      } else {
        console.error('Could not delete chapter id', deleteId, '; found index', index);
      }
    }),
  }
}

export const chapters = createChapters();
chapters.subscribe(value => localStorage.chapters = JSON.stringify(value));

export const selectedChapterId = writable(localStorage.getItem('selectedChapterId'));
selectedChapterId.subscribe(value => localStorage.selectedChapterId = value);

export const selectedChapter = derived([chapters, selectedChapterId], ([$chapters, $selectedChapterId]) => {
  return $chapters.filter(c => c.id == Number($selectedChapterId))[0];
});

export const currentPreview = writable();
export const selectLinkFromNode = writable();
export const firstCharacterFieldElements = writable({});
export const lastNodeWouldCauseInfiniteLoop = writable(false);

export const nodeSequence = derived([nodes, selectedChapter], ([$nodes, $selectedChapter]) => {
  let nodeSequence = [];

  if ($selectedChapter) {
    let currentNode = $nodes[$selectedChapter.firstNode];
    nodeSequence = [$selectedChapter.firstNode];
    lastNodeWouldCauseInfiniteLoop.set(false);
  
    while (currentNode && ((currentNode.branchTo && currentNode.branchTo.length) || currentNode.linkTo)) {
      if (currentNode.branchTo) {
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

function getNewId(ids) {
  if (ids && Array.isArray(ids) && ids.length) {
    return ids.reduce((maxId, id) => Math.max(id, maxId), -1) + 1;
  }
  return 1;
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
