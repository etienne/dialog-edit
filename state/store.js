import React, { useReducer } from 'react';

export const Store = React.createContext();

const initialState = {
  nodes: {},
  lastId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'yo':
      break;
    default:
    
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
