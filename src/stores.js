import { writable } from 'svelte/store';

function createDialogs() {
	const { subscribe, set, update } = writable({});

	return {
		subscribe,
    add: () => update(d => {
      const newId = getNewId(Object.keys(d));
      d[newId] = { id: newId, label: 'untitled dialog' };
      return d;
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