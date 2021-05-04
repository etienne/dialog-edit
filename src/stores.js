import { writable, derived } from 'svelte/store';

function createDialogs() {
	const { subscribe, set, update } = writable({});

	return {
		subscribe,

    add: () => update(d => {
      const newId = getNewId(Object.keys(d));
      d[newId] = {
        id: newId,
        label: 'untitled dialog',
        nodes: [{}],
      };
      return d;
    }),

    update: newDialog => update(d => {
      return {...d, [newDialog.id]: newDialog };
    }),

    updateNode: (dialogId, index, newNode) => update(d => {
      const newNodes = [...d[dialogId].nodes];
      newNodes[index] = newNode;
      const newDialog = {...d[dialogId], nodes: newNodes};
      return {...d, [dialogId]: newDialog};
    }),

    insertNodeAfter: (dialogId, index) => update(d => {
      const newNodes = [...d[dialogId].nodes];
      newNodes.splice(index + 1, 0, {});
      const newDialog = {...d[dialogId], nodes: newNodes};
      return {...d, [dialogId]: newDialog};
    }),

    branchFrom: (dialogId, index) => update(d => {
      const nodesToKeep = [...d[dialogId].nodes].slice(0, index);
      const nodesToBranchOff = [...d[dialogId].nodes].slice(index);
      const newId = getNewId(Object.keys(d));
      const updatedDialog = {...d[dialogId], nodes: nodesToKeep, branchTo: [newId]};
      const newDialog = {id: newId, nodes: nodesToBranchOff};
      return {...d, [dialogId]: updatedDialog, [newId]: newDialog};
    }),

    prependNode: dialogId => update(d => {
      const newNodes = [...d[dialogId].nodes];
      newNodes.unshift({});
      const newDialog = {...d[dialogId], nodes: newNodes};
      return {...d, [dialogId]: newDialog};
    }),

    deleteNode: (dialogId, index) => update(d => {
      const newNodes = [...d[dialogId].nodes];
      newNodes.splice(index, 1);
      const newDialog = {...d[dialogId], nodes: newNodes};
      return {...d, [dialogId]: newDialog};
    }),
	};
}

function getNewId(ids) {
  if (ids && Array.isArray(ids) && ids.length) {
    return ids.reduce((maxId, id) => Math.max(id, maxId), -1) + 1;
  }
  return 1;
}

export const dialogs = createDialogs();
export const selectedDialog = writable(1);

export const dialogSequence = derived([dialogs, selectedDialog], ([$dialogs, $selectedDialog]) => {
  let currentDialog = $dialogs[$selectedDialog];
  let dialogSequence = [$selectedDialog];

  while (currentDialog && currentDialog.branchTo && currentDialog.branchTo.length) {
    dialogSequence.push(currentDialog.branchTo[0]);
    currentDialog = $dialogs[currentDialog.branchTo[0]];
  }

  return dialogSequence;
});

export const labelledDialogIds = derived(dialogs, $dialogs => {
  let ids = Object.keys($dialogs);
  return ids.filter(id => 'label' in $dialogs[id]);
});
