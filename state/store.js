import React, { useReducer } from 'react';

export const Store = React.createContext();

const initialState = {
  nodes: {},
  lastId: 0,
  selectedBranch: null,
  selectedChoices: {},
  activeChoice: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'INITIAL_LOAD': {
      return { ...state, ...action.payload };
    }
    case 'ADD_NODE': {
      const id = state.lastId + 1;
      const newNode = { [id]: { id, ...action.payload } };
      let redirectedNode = {};
      let selectedChoices = {};
      if (action.payload.parent) {
        const childrenIds = Object.keys(state.nodes).filter(node => state.nodes[node].parent == action.payload.parent);
        if (childrenIds.length >= 1) {
          selectedChoices = { selectedChoices: { ...state.selectedChoices, [action.payload.parent]: id } };
        }
        if (action.payload.redirect !== false) {
          if (childrenIds.length > 1) {
            console.warn('Possible incorrect redirection with parent', action.payload.parent, 'for new node', id);
          } else if (childrenIds.length) {
            const redirectedNodeId = childrenIds[0];
            redirectedNode = { [redirectedNodeId]: { ...state.nodes[redirectedNodeId], parent: id } };
          }
        }
      }
      return { ...state, lastId: id, nodes: { ...state.nodes, ...newNode, ...redirectedNode }, ...selectedChoices};
    }
    case 'UPDATE_NODE': {
      const { id } = action.payload;
      const updatedNode = { [id]: { ...state.nodes[id], ...action.payload } };
      return { ...state, nodes: { ...state.nodes, ...updatedNode }};
    }
    case 'SET_ACTIVE_CHOICE': {
      return { ...state, activeChoice: action.payload };
    }
    case 'SET_SELECTED_BRANCH': {
      return { ...state, selectedBranch: action.payload };
    }
    case 'SET_SELECTED_CHOICE': {
      return { ...state, selectedChoices: { ...state.selectedChoices, ...action.payload }};
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
