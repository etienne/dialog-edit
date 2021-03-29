import { reducer } from './store';
import { emptyState, state, previousState, nextId } from './fixtures';
let pristineState = {};

beforeEach(() => {
  pristineState = JSON.parse(JSON.stringify(state));
});

describe('ADD_DIALOG', () => {
  it('should create a new dialog', () => {
    const newDialog = {
      label: 'Trop cool ton dialogue',
      firstNode: 1,
    };

    expect(reducer(pristineState, { type: 'ADD_DIALOG', payload: newDialog })).toEqual({
      ...state,
      dialogs: {
        ...state.dialogs,
        2: { id: 2, ...newDialog },
      },
    });
  })

  it('should assign id 1 for first dialog', () => {
    const newDialog = {
      label: 'Trop cool ton dialogue',
      firstNode: 1,
    };

    expect(reducer(emptyState, { type: 'ADD_DIALOG', payload: newDialog })).toEqual({
      ...emptyState,
      dialogs: {
        1: { id: 1, ...newDialog },
      },
    });
  })

  it('should create a blank node if no firstNode is given', () => {
    const newDialog = {
      label: 'Trop cool ton dialogue sans firstNode',
    };

    expect(reducer(pristineState, { type: 'ADD_DIALOG', payload: newDialog })).toEqual({
      ...state,
      dialogs: {
        ...state.dialogs,
        2: { id: 2, firstNode: nextId, ...newDialog },
      },
      nodes: {
        ...state.nodes,
        [nextId]: { id: nextId },
      },
    });
  });
});

describe('ADD_NODE', () => {
  it('should create a new node', () => {
    const newNode = {
      character: 'Roger',
      text: 'Yo',
    };
    
    expect(reducer(pristineState, { type: 'ADD_NODE', payload: newNode })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        [nextId]: { id: nextId, ...newNode },
      },
    });
  });

  it('should sanitize input', () => {
    const newNode = {
      character: ['this is', 'an array'],
      text: 125,
      children: ['2', 'roger'],
    };

    expect(reducer(pristineState, { type: 'ADD_NODE', payload: newNode })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        [nextId]: {
          id: nextId,
          character: 'this is,an array',
          text: '125',
          children: [2],
        },
      },
    });
  });

  it('should properly reorder when inserting after a node with a single child', () => {
    const newNode = {
      character: 'To be inserted',
      text: 'Yo',
    };

    const payload = {
      ...newNode,
      insertAfter: 1,
    };
    
    expect(reducer(pristineState, { type: 'ADD_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        1: { ...state.nodes[1], children: [nextId] },
        [nextId]: { id: nextId, ...newNode, children: [2] },
      },
    });
  });

  it('should properly reorder when inserting after a node with siblings', () => {
    const newNode = {
      character: 'To be inserted',
      text: 'Yo',
    };

    const payload = {
      ...newNode,
      insertAfter: 3,
    };
    
    expect(reducer(pristineState, { type: 'ADD_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        3: { ...state.nodes[3], children: [nextId] },
        [nextId]: { id: nextId, ...newNode, children: [5] },
      },
    });
  });

  it('should properly reorder when inserting after a node with several children', () => {
    const newNode = {
      character: 'To be inserted',
      text: 'Yo',
    };

    const payload = {
      ...newNode,
      insertAfter: 2,
    };
    
    expect(reducer(pristineState, { type: 'ADD_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        2: { ...state.nodes[2], children: [nextId, 4] },
        [nextId]: { id: nextId, ...newNode, children: [3] },
      },
      selectedChoices: { 4: 6, [nextId]: 3 },
    });
  });

  it('should add multiple children when branchFrom is specified', () => {
    const newNode = {
      character: 'To be branched out',
      text: 'Yo',
    };

    const payload = {
      ...newNode,
      branchFrom: 2,
    };
    
    expect(reducer(pristineState, { type: 'ADD_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        2: { ...state.nodes[2], children: [3, 4, nextId] },
        [nextId]: { id: nextId, ...newNode },
      },
      selectedChoices: {
        2: nextId,
        4: 6,
      },
    });
  });

  it('should attach the node to a dialog when specified', () => {
    const newNode = {
      character: 'Roger',
      text: 'Yo',
    };

    const payload = {
      ...newNode,
      dialog: 1,
    };
    
    expect(reducer(pristineState, { type: 'ADD_NODE', payload })).toEqual({
      ...state,
      dialogs: {
        ...state.dialogs,
        1: { ...state.dialogs[1], firstNode: nextId },
      },
      nodes: {
        ...state.nodes,
        [nextId]: { id: nextId, ...newNode },
      },
    });
  });
});

describe('UPDATE_NODE', () => {
  it('should preserve properties that are absent from the payload', () => {
    const payload = {
      id: 1,
      character: 'Roger',
      text: 'Updated text',
    };

    expect(reducer(pristineState, { type: 'UPDATE_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        1: {
          id: 1,
          character: 'Roger',
          text: 'Updated text',
          children: [2],
        },
      },
    });
  });

  it('should sanitize input', () => {
    const updatedNode = {
      id: '1',
      character: ['this is', 'an array'],
      text: 125,
      children: ['3', 'roger'],
    };

    expect(reducer(pristineState, { type: 'UPDATE_NODE', payload: updatedNode })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        1: {
          id: 1,
          character: 'this is,an array',
          text: '125',
          children: [3],
        },
      },
    });
  });
});

describe('DELETE_DIALOG', () => {
  it('should delete the specified dialog', () => {
    const updatedDialogs = { ...state.dialogs };
    delete updatedDialogs[1];
    expect(reducer(pristineState, { type: 'DELETE_DIALOG', payload: 1 })).toEqual({
      ...state,
      dialogs: updatedDialogs,
      selectedDialog: null,
    });
  });
});

// describe('SET_SELECTED_DIALOG', () => {
//   it('should change the selected branch', () => {
//     const selectedDialog = 2;
    
//     expect(reducer(pristineState, { type: 'ADD_NODE', payload: newNode })).toEqual({
//       ...state,
//       nodes: {
//         ...state.nodes,
//         4: { id: 4, ...newNode },
//       },
//     });
//   });
// });

describe('REVERT_TO_VERSION', () => {
  it('should revert the whole state to a previous version', () => {
    expect(reducer(pristineState, { type: 'REVERT_TO_VERSION', payload: previousState })).toEqual(previousState);
  });
});

describe('DELETE_NODE', () => {
  const updatedNodes = { ...state.nodes };
  delete updatedNodes[2];

  it('should permanently delete the node', () => {
    expect(reducer(pristineState, { type: 'DELETE_NODE', payload: 2 })).toEqual({
      ...state,
      nodes: {
        ...updatedNodes,
        1: {
          ...state.nodes[1],
          children: [],
        }
      }
    });
  });
});

describe('SOFT_DELETE_NODE', () => {
  it('should detach the node from the specified parent and transfer its children to it', () => {
    const payload = {
      id: 2,
      detachFrom: 1,
    };
  
    expect(reducer(pristineState, { type: 'SOFT_DELETE_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        1: {
          ...state.nodes[1],
          children: [3],
        }
      }
    });
  });

  it('should do nothing if specified parent doesn’t have the target node as child', () => {
    const payload = {
      id: 2,
      detachFrom: 3,
    };

    expect(reducer(pristineState, { type: 'SOFT_DELETE_NODE', payload })).toEqual(pristineState);
  });

  it('should work when target node has no children', () => {
    const payload = {
      id: 5,
      detachFrom: 3,
    };

    expect(reducer(pristineState, { type: 'SOFT_DELETE_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        3: {
          ...state.nodes[3],
          children: [],
        },
      },
    });
  });

  it('should work when target node has both siblings and children', () => {
    const startState = reducer(pristineState, { type: 'SET_SELECTED_CHOICE', payload: { 2: 4 }});

    const payload = {
      id: 4,
      detachFrom: 2,
    };

    expect(reducer(startState, { type: 'SOFT_DELETE_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        2: {
          ...state.nodes[2],
          children: [3, 6],
        },
      }
    });
  });

  it('should work when target node has no parent', () => {
    const payload = {
      id: 1,
      detachFrom: undefined,
    };

    expect(reducer(pristineState, { type: 'SOFT_DELETE_NODE', payload })).toEqual({
      ...state,
      dialogs: {
        ...state.dialogs,
        1: {
          ...state.dialogs[1],
          firstNode: 2,
        }
      }
    });
  });
});

describe('UPDATE_DIALOG', () => {
  it('should update the dialog', () => {
    const updatedDialog = {
      id: 1,
      label: 'Trop malade ton dialogue',
    };

    expect(reducer(pristineState, { type: 'UPDATE_DIALOG', payload: updatedDialog })).toEqual({
      ...state,
      dialogs: {
        ...state.dialogs,
        1: { ...state.dialogs[1], ...updatedDialog },
      },
    });
  })
});
