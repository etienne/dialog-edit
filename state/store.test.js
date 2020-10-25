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
      parent: 3
    };
    
    expect(reducer(state, { type: 'ADD_NODE', payload: newNode })).toEqual({
      ...state,
      nodes: {
        ...state.nodes,
        4: { id: 4, ...newNode },
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
