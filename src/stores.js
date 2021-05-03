import { writable } from 'svelte/store';

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