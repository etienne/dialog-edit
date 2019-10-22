import { reducer } from './store';
import state from './fixtures';

describe('nodes reducer', () => {
  it('should create a new node', () => {
    const newNode = {
      character: 'Roger',
      text: 'Yo',
      parent: 3
    };
    
    expect(reducer(state, { type: 'ADD_NODE', payload: newNode })).toEqual({
      ...state,
      lastId: 4,
      nodes: {
        ...state.nodes,
        4: { id: 4, ...newNode },
      },
    });
  });
})
