import { reducer } from './store';
import state from './fixtures';

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
