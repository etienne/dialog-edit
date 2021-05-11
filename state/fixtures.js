const emptyState = {
  dialogs: {},
  nodes: {},
  selectedDialog: null,
  selectedBranches: {},
  activeBranch: null,
};

/*

(1)
 |
(2)
 +—————+
(3)   (4)
 |     +—————+
(5)   (6)   (7)

*/

const state = {
  dialogs: {
    1: {
      id: 1,
      label: 'Branche existante',
      firstNode: 1,
    },
  },
  nodes: {
    1: {
      id: 1,
      children: [2],
    },
    2: {
      id: 2,
      children: [3, 4],
    },
    3: {
      id: 3,
      children: [5],
    },
    4: {
      id: 4,
      children: [6, 7],
    },
    5: {
      id: 5,
    },
    6: {
      id: 6,
    },
    7: {
      id: 7,
    },
  },
  selectedDialog: 1,
  selectedBranches: { 2: 3, 4: 6 },
  activeBranch: null,
};

const nextId = 8;

const previousState = {
  nodes: {
    1: {
      id: 1,
      label: "Vedettariat",
      character: "Bernard",
      text: "Faque toi Stefano, tu fais quoi dans vie? T’es tu aux études?"
    },
  },
};

export { emptyState, state, previousState, nextId };