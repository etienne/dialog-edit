import React, { useReducer } from 'react';

export const Store = React.createContext();

const initialState = {
  nodes: { 1: { id: 1 } },
  lastId: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_NODE': {
      const id = state.lastId + 1;
      const newNode = { [id]: { id, parent: action.payload } };
      return { ...state, lastId: id, nodes: { ...state.nodes, ...newNode }};
    }
    case 'UPDATE_NODE_CHARACTER': {
      const { id, character } = action.payload;
      const updatedNode = { [id]: { ...state.nodes[id], character } };
      return { ...state, nodes: { ...state.nodes, ...updatedNode }};
    }
    case 'UPDATE_NODE_TEXT': {
      const { id, text } = action.payload;
      const updatedNode = { [id]: { ...state.nodes[id], text } };
      return { ...state, nodes: { ...state.nodes, ...updatedNode }};
    }
    default:
      console.error('Invalid action type:', action);
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
