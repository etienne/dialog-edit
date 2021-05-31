import { writable, derived, get } from 'svelte/store';

function createHistory() {
  const { subscribe, update, set } = writable([]);

  return {
    subscribe,
    set,

    append: (nodeId, index) => update(h => {
      const currentIndex = get(currentPlayerIndex);
      if (currentIndex !== h.length - 1) {
        // We’re not at the end of history; remove anything past this point
        h.splice(currentIndex + 1);
      }
      h.push([nodeId, index]);
      currentPlayerIndex.set(h.length - 1);
      return h;
    }),

    reset: () => {
      set([]);
      currentPlayerIndex.set(0);
    },
  };
}

export const playerHistory = createHistory();

function createCurrentPlayerIndex() {
  const { subscribe, update, set } = writable(0);

  return {
    subscribe,
    set,

    back: () => update(c => c > 0 ? c - 1 : 0),
    forward: () => update(c => c + 1),
  };
}

export const currentPlayerIndex = createCurrentPlayerIndex();

export const allowBack = derived(currentPlayerIndex, ($currentPlayerIndex) => {
  return $currentPlayerIndex > 0;
});

export const allowForward = derived([playerHistory, currentPlayerIndex], ([$playerHistory, $currentPlayerIndex]) => {
  return $currentPlayerIndex < $playerHistory.length - 1;
});
