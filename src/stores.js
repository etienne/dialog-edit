import { writable, derived } from 'svelte/store';

function createNodes() {
	const { subscribe, update } = writable(JSON.parse(localStorage.getItem('nodes')) || {});

	return {
		subscribe,

    add: () => update(d => {
      const newId = getNewId(Object.keys(d));
      d[newId] = {
        id: newId,
        label: '',
        lines: [{}],
        newlyCreated: true,
      };
      selectedNode.set(newId);
      return d;
    }),

    update: newNode => update(d => {
      return {...d, [newNode.id]: newNode };
    }),

    touch: nodeId => update(d => {
      const updatedNode = d[nodeId];
      if (updatedNode.newlyCreated) {
        delete updatedNode.newlyCreated;
      }
      return {...d, [nodeId]: updatedNode};
    }),

    delete: deleteId => update(d => {
      Object.keys(d).forEach(id => {
        if (d[id].branchTo) {
          const updatedBranchTo = d[id].branchTo.filter(b => b !== deleteId);
          d[id] = {...d[id], branchTo: updatedBranchTo, selectedBranch: 0};
        }
      });
      delete d[deleteId];

      return d;
    }),

    deleteBranch: (nodeId, index) => update(d => {
      const parentBranch = d[nodeId];
      parentBranch.branchTo.splice(index, 1);
      if (parentBranch.branchTo.length === 1) {
        // Only one branch remains after deletion; merge last branch back into parent branch
        const updatedLines = [...parentBranch.lines, ...d[parentBranch.branchTo[0]].lines];
        return {...d, [nodeId]: {...parentBranch, lines: updatedLines, branchTo: null, selectedBranch: null}};
      } else {
        const newSelectedBranch = index - 1 >= 0 ? index - 1 : 0;
        const updatedNode = {...parentBranch, selectedBranch: newSelectedBranch};
        return {...d, [nodeId]: updatedNode};
        }
    }),

    updateLine: (nodeId, index, newLine) => update(d => {
      const updatedLines = [...d[nodeId].lines];
      updatedLines[index] = newLine;
      const newNode = {...d[nodeId], lines: updatedLines};
      return {...d, [nodeId]: newNode};
    }),

    insertLineAfter: (nodeId, index) => update(d => {
      const updatedLines = [...d[nodeId].lines];
      let character;
      if (index > 0) {
        character = updatedLines[index - 1].character;
      }
      console.log('index=', index, 'character=', character);
      updatedLines.splice(index + 1, 0, {newlyCreated: true, character});
      const newNode = {...d[nodeId], lines: updatedLines};
      return {...d, [nodeId]: newNode};
    }),

    branchFrom: (nodeId, index) => update(d => {
      const newId = getNewId(Object.keys(d));
      const newNode = {id: newId, lines: [{}]};
      const currentBranchIds = d[nodeId].branchTo || [];

      if (index) {
        const linesToKeep = [...d[nodeId].lines].slice(0, index);
        const linesToBranchOff = [...d[nodeId].lines].slice(index);
        const branchedId = getNewId([...Object.keys(d), newId]);
        const newBranchTo = [...currentBranchIds, branchedId, newId];
        const updatedNode = {...d[nodeId], lines: linesToKeep, branchTo: newBranchTo, selectedBranch: newBranchTo.length - 1};
        const branchedNode = {id: branchedId, lines: linesToBranchOff};
        return {...d, [nodeId]: updatedNode, [branchedId]: branchedNode, [newId]: newNode};
      } else {
        const newBranchTo = [...currentBranchIds, newId];
        const updatedNode = {...d[nodeId], branchTo: newBranchTo, selectedBranch: newBranchTo.length - 1};
        return {...d, [nodeId]: updatedNode, [newId]: newNode};
      }
    }),

    selectBranch: (nodeId, index) => update(d => {
      const updatedNode = {...d[nodeId], selectedBranch: index };
      return {...d, [nodeId]: updatedNode};
    }),

    prependLine: nodeId => update(d => {
      const newLines = [...d[nodeId].lines];
      newLines.unshift({});
      const newNode = {...d[nodeId], lines: newLines};
      return {...d, [nodeId]: newNode};
    }),

    deleteLine: (nodeId, index) => update(d => {
      const newLines = [...d[nodeId].lines];
      newLines.splice(index, 1);
      const newNode = {...d[nodeId], lines: newLines};
      return {...d, [nodeId]: newNode};
    }),
	};
}

function getNewId(ids) {
  if (ids && Array.isArray(ids) && ids.length) {
    return ids.reduce((maxId, id) => Math.max(id, maxId), -1) + 1;
  }
  return 1;
}

export const nodes = createNodes();
nodes.subscribe(value => localStorage.nodes = JSON.stringify(value));

export const selectedNode = writable(localStorage.getItem('selectedNode') || 1);
selectedNode.subscribe(value => localStorage.selectedNode = value);

export const currentPreview = writable();
export const firstCharacterFieldElements = writable({});

export const nodeSequence = derived([nodes, selectedNode], ([$nodes, $selectedNode]) => {
    let currentNode = $nodes[$selectedNode];
    let nodeSequence = [$selectedNode];

    while (currentNode && currentNode.branchTo && currentNode.branchTo.length) {
      let selectedBranchIndex = currentNode.selectedBranch || 0;
      nodeSequence.push(currentNode.branchTo[selectedBranchIndex]);
      currentNode = $nodes[currentNode.branchTo[selectedBranchIndex]];
    }

    return nodeSequence;
  }
);

export const labelledNodeIds = derived(nodes, $nodes => {
  let ids = Object.keys($nodes);
  return ids.filter(id => 'label' in $nodes[id]);
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
