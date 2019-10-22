const state = {
  nodes: {
    1: {
      id: 1,
      label: "Vedettariat",
      character: "Bernard",
      text: "Faque toi Stefano, tu fais quoi dans vie? T’es tu aux études?"
    },
    2: {
      id: 2,
      parent: "1",
      character: "Stefano",
      text: "Non, je travaille! Je suis à mon compte."
    },
    3: {
      id: 3,
      parent: "2",
      character: "Bernard",
      text: "Ah, c’est bon ça. Pas de boss!"
    }
  }
}

export default state;