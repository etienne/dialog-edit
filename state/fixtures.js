const emptyState = {
  branches: {},
  nodes: {},
  selectedBranch: null,
  selectedChoices: {},
  activeChoice: null,
};

const state = {
  branches: {
    1: {
      id: 1,
      label: 'Branche existante',
      firstNode: 1,
    },
  },
  nodes: {
    1: {
      id: 1,
      character: "Bernard",
      text: "Faque toi Stefano, tu fais quoi dans vie? T’es tu aux études?",
      children: [2],
    },
    2: {
      id: 2,
      character: "Stefano",
      text: "Non, je travaille! Je suis à mon compte.",
      children: [3],
    },
    3: {
      id: 3,
      character: "Bernard",
      text: "Ah, c’est bon ça. Pas de boss!",
    },
  },
  selectedBranch: null,
  selectedChoices: {},
  activeChoice: null,
};

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

export { emptyState, state, previousState };
