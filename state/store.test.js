import { reducer } from './store';
import { emptyState, state, previousState } from './fixtures';

describe('ADD_BRANCH', () => {
  it('should create a new branch', () => {
    const newBranch = {
      label: 'Trop cool ta branche',
      firstNode: 1,
    };

    expect(reducer(state, { type: 'ADD_BRANCH', payload: newBranch })).toEqual({
      ...state,
      branches: {
        ...state.branches,
        2: { id: 2, ...newBranch },
      },
    });
  })

  it('should assign id 1 for first branch', () => {
    const newBranch = {
      label: 'Trop cool ta branche',
      firstNode: 1,
    };

    expect(reducer(emptyState, { type: 'ADD_BRANCH', payload: newBranch })).toEqual({
      ...emptyState,
      branches: {
        1: { id: 1, ...newBranch },
      },
    });
  })

  it('should create a blank node if no firstNode is given', () => {
    const newBranch = {
      label: 'Trop cool ta branche sans firstNode',
    };

    expect(reducer(state, { type: 'ADD_BRANCH', payload: newBranch })).toEqual({
      ...state,
      branches: {
        ...state.branches,
        2: { id: 2, firstNode: 4, ...newBranch },
      },
      nodes: {
        ...state.nodes,
        4: { id: 4 },
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
    
    expect(reducer(state, { type: 'ADD_NODE', payload: newNode })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        4: { id: 4, ...newNode },
      },
    });
  });

  it('should sanitize input', () => {
    const newNode = {
      character: ['this is', 'an array'],
      text: 125,
      children: ['2', 'roger'],
    };

    expect(reducer(state, { type: 'ADD_NODE', payload: newNode })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        4: {
          id: 4,
          character: 'this is,an array',
          text: '125',
          children: [2],
        },
      },
    });
  });

  it('should properly reorder when insertAfter is specified', () => {
    const newNode = {
      character: 'To be inserted',
      text: 'Yo',
    };

    const payload = {
      ...newNode,
      insertAfter: 2,
    };
    
    expect(reducer(state, { type: 'ADD_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        2: { ...state.nodes[2], children: [4] },
        4: { id: 4, ...newNode, children: [3] },
      },
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
    
    expect(reducer(state, { type: 'ADD_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        2: { ...state.nodes[2], children: [3, 4] },
        4: { id: 4, ...newNode },
      },
      selectedChoices: {
        2: 4,
      },
    });
  });

  it('should attach the node to a branch when specified', () => {
    const newNode = {
      character: 'Roger',
      text: 'Yo',
    };

    const payload = {
      ...newNode,
      branch: 1,
    };
    
    expect(reducer(state, { type: 'ADD_NODE', payload })).toEqual({
      ...state,
      branches: {
        ...state.branches,
        1: { ...state.branches[1], firstNode: 4 },
      },
      nodes: {
        ...state.nodes,
        4: { id: 4, ...newNode },
      },
    });
  });
});

describe('UPDATE_NODE', () => {
  it('should sanitize input', () => {
    const updatedNode = {
      id: '1',
      character: ['this is', 'an array'],
      text: 125,
      children: ['2', 'roger'],
    };

    expect(reducer(state, { type: 'UPDATE_NODE', payload: updatedNode })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        1: {
          id: 1,
          character: 'this is,an array',
          text: '125',
          children: [2],
        },
      },
    });
  });
});

describe('DELETE_BRANCH', () => {
  it('should delete the specified branch', () => {
    const updatedBranches = { ...state.branches };
    delete updatedBranches[1];
    expect(reducer(state, { type: 'DELETE_BRANCH', payload: 1 })).toEqual({
      ...state,
      branches: updatedBranches,
      selectedBranch: null,
    });
  });
});

// describe('SET_SELECTED_BRANCH', () => {
//   it('should change the selected branch', () => {
//     const selectedBranch = 2;
    
//     expect(reducer(state, { type: 'ADD_NODE', payload: newNode })).toEqual({
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
    expect(reducer(state, { type: 'REVERT_TO_VERSION', payload: previousState })).toEqual(previousState);
  });
});

describe('DELETE_NODE', () => {
  const updatedNodes = { ...state.nodes };
  delete updatedNodes[2];

  it('should permanently delete the node', () => {
    expect(reducer(state, { type: 'DELETE_NODE', payload: 2 })).toEqual({
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
  const payload = {
    id: 3,
    detachFrom: 2,
  };

  it('should detach the node from the specified parent', () => {
    expect(reducer(state, { type: 'SOFT_DELETE_NODE', payload })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        2: {
          ...state.nodes[2],
          children: [],
        }
      }
    });
  });
});

describe('UPDATE_BRANCH', () => {
  it('should update the branch', () => {
    const updatedBranch = {
      id: 1,
      label: 'Trop malade ta branche',
    };

    expect(reducer(state, { type: 'UPDATE_BRANCH', payload: updatedBranch })).toEqual({
      ...state,
      branches: {
        ...state.branches,
        1: { ...state.branches[1], ...updatedBranch },
      },
    });
  })
});
