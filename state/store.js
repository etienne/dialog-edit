import React, { useReducer } from 'react';

export const Store = React.createContext();

const initialState = {
  nodes: {},
  branches: {},
  selectedBranch: null,
  selectedChoices: {},
  activeChoice: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'INITIAL_LOAD': {
      return { ...state, ...action.payload };
    }

    case 'ADD_BRANCH': {
      const branchId = getNewId(Object.keys(state.branches));
      const newBranch = { [branchId]: { id: branchId, ...action.payload } };
      let nodes = state.nodes;
      let nodeId, blankNode;

      if (!action.payload.firstNode) {
        nodeId = getNewId(Object.keys(state.nodes));
        blankNode = { [nodeId]: { id: nodeId } };
        newBranch[branchId].firstNode = nodeId;
        nodes = { ...state.nodes, ...blankNode };
      }

      return { ...state, branches: { ...state.branches, ...newBranch }, nodes };
    }

    case 'ADD_NODE': {
      const id = getNewId(Object.keys(state.nodes));
      const sanitizedPayload = sanitizeNode(action.payload);
      const newNode = { [id]: { id, ...sanitizedPayload } };
      let redirectedNode = {};
      let selectedChoices = {};
      let parentNode = {};

      if (action.payload.branch) {
        delete newNode[id].branch;
        state.branches[action.payload.branch].firstNode = id;
      }

      if (action.payload.insertAfter) {
        delete newNode[id].insertAfter;

        const parentData = { ...state.nodes[action.payload.insertAfter] };
        const parentChildren = parentData.children;
        newNode[id].children = parentChildren;
        parentData.children = [id];
        parentNode = { [action.payload.insertAfter]: parentData };
      } else if (action.payload.branchFrom) {
        delete newNode[id].branchFrom;

        const parentData = { ...state.nodes[action.payload.branchFrom] };
        parentData.children = Array.isArray(parentData.children) ? [...parentData.children, id].sort() : [id];
        parentNode = { [action.payload.branchFrom]: parentData };
        selectedChoices[action.payload.branchFrom] = id;
      }

      return {
        ...state,
        nodes: {
          ...state.nodes,
          ...newNode,
          ...redirectedNode,
          ...parentNode,
        },
        selectedChoices: {
          ...state.selectedChoices,
          ...selectedChoices,
        }
      };
    }

    case 'DELETE_BRANCH': {
      const updatedBranches = { ...state.branches };
      delete updatedBranches[action.payload];
      return { ...state, branches: updatedBranches, selectedBranch: null };
    }

    case 'UPDATE_BRANCH': {
      const { id } = action.payload;
      const updatedBranch = { [id]: { ...state.branches[id], ...action.payload } };
      return { ...state, branches: { ...state.branches, ...updatedBranch }};
    }

    case 'UPDATE_NODE': {
      const sanitizedPayload = sanitizeNode(action.payload);
      const { id } = sanitizedPayload;
      const updatedNode = { [id]: { ...state.nodes[id], ...sanitizedPayload } };
      return { ...state, nodes: { ...state.nodes, ...updatedNode }};
    }

    case 'SOFT_DELETE_NODE': {
      const targetNode = state.nodes[action.payload.id];
      const parentId = action.payload.detachFrom;
      let updatedChildren = state.nodes[parentId].children.filter(c => c != action.payload.id);
      updatedChildren = [...updatedChildren, ...targetNode.children];
      
      const updatedParent = { [parentId]: { ...state.nodes[parentId], children: updatedChildren }};
      return { ...state, nodes: { ...state.nodes, ...updatedParent }};
    }

    case 'DELETE_NODE': {
      const updatedNodes = { ...state.nodes };

      Object.keys(state.nodes).forEach((id) => {
        if (updatedNodes[id].children) {
          updatedNodes[id].children = state.nodes[id].children.filter(id => id != action.payload);
        }
      });

      const updatedSelectedChoices = {};
      const choicesToReset = Object.keys(state.selectedChoices).filter(id => state.selectedChoices[id] == action.payload);
      choicesToReset.forEach(id => updatedSelectedChoices[id] = null);

      delete updatedNodes[action.payload];
      return { ...state, nodes: updatedNodes, selectedChoices: { ...state.selectedChoices, ...updatedSelectedChoices } };
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
    case 'REVERT_TO_VERSION': {
      return action.payload;
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

function getNewId(ids) {
  if (ids && Array.isArray(ids) && ids.length) {
    return ids.reduce((maxId, id) => Math.max(id, maxId), -1) + 1;
  }
  return 1;
}

function sanitizeNode(node) {
  const sanitizedNode = { ...node };
  if (node.id) {
    sanitizedNode.id = Number(node.id);
  }

  if (node.character) {
    sanitizedNode.character = String(node.character);
  }

  if (node.text) {
    sanitizedNode.text = String(node.text);
  }

  if (node.children) {
    if (Array.isArray(node.children)) {
      sanitizedNode.children = node.children.map(n => Number(n)).filter(n => !isNaN(n));
    } else {
      delete sanitizedNode.children;
    }
  }

  return sanitizedNode;
}
