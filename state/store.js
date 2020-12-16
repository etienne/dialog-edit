import React, { useReducer } from 'react';

export const Store = React.createContext();

const initialState = {
  nodes: {},
  branches: {},
  selectedBranch: null,
  selectedChoices: {},
  activeChoice: null,
};

export function reducer(state, { type, payload }) {
  switch (type) {
    case 'INITIAL_LOAD': {
      return { ...state, ...payload };
    }

    case 'ADD_BRANCH': {
      const branchId = getNewId(Object.keys(state.branches));
      const newBranch = { [branchId]: { id: branchId, ...payload } };
      let nodes = state.nodes;
      let nodeId, blankNode;

      if (!payload.firstNode) {
        nodeId = getNewId(Object.keys(state.nodes));
        blankNode = { [nodeId]: { id: nodeId } };
        newBranch[branchId].firstNode = nodeId;
        nodes = { ...state.nodes, ...blankNode };
      }

      return { ...state, branches: { ...state.branches, ...newBranch }, nodes };
    }

    case 'ADD_NODE': {
      const id = getNewId(Object.keys(state.nodes));
      const sanitizedPayload = sanitizeNode(payload);

      const newNode = { [id]: { id, ...sanitizedPayload } };
      let selectedChoices = { ...state.selectedChoices };
      let parentNode = {};

      if (payload.branch) {
        // Attach node to the specified branch
        delete newNode[id].branch;
        state.branches[payload.branch].firstNode = id;
      }

      if (payload.insertAfter) {
        delete newNode[id].insertAfter;

        const parentData = { ...state.nodes[payload.insertAfter] };
        const selectedChoiceFromParent = selectedChoices[payload.insertAfter];
        let newChildren;

        if (selectedChoiceFromParent) {
          newChildren = parentData.children.map(c => {
            return selectedChoiceFromParent === c ? id : c;
          });
          selectedChoices[id] = selectedChoiceFromParent;
          delete selectedChoices[payload.insertAfter];
        } else {
          newChildren = [id];
        }

        newNode[id].children = selectedChoiceFromParent ? [selectedChoiceFromParent] : parentData.children;
        parentData.children = newChildren;
        parentNode = { [payload.insertAfter]: parentData };
      } else if (payload.branchFrom) {
        delete newNode[id].branchFrom;

        const parentData = { ...state.nodes[payload.branchFrom] };
        parentData.children = Array.isArray(parentData.children) ? [...parentData.children, id].sort() : [id];
        parentNode = { [payload.branchFrom]: parentData };
        selectedChoices[payload.branchFrom] = id;
      }

      return {
        ...state,
        nodes: {
          ...state.nodes,
          ...newNode,
          ...parentNode,
        },
        selectedChoices,
      };
    }

    case 'DELETE_BRANCH': {
      const updatedBranches = { ...state.branches };
      delete updatedBranches[payload];
      return { ...state, branches: updatedBranches, selectedBranch: null };
    }

    case 'UPDATE_BRANCH': {
      const { id } = payload;
      const updatedBranch = { [id]: { ...state.branches[id], ...payload } };
      return { ...state, branches: { ...state.branches, ...updatedBranch }};
    }

    case 'UPDATE_NODE': {
      const sanitizedPayload = sanitizeNode(payload);
      const { id } = sanitizedPayload;
      const updatedNode = { [id]: { ...state.nodes[id], ...sanitizedPayload } };
      return { ...state, nodes: { ...state.nodes, ...updatedNode }};
    }

    case 'SOFT_DELETE_NODE': {
      const targetNode = state.nodes[payload.id];
      const parentId = payload.detachFrom;

      if (parentId) {
        let updatedChildren = state.nodes[parentId].children.filter(c => c != payload.id);

        if (targetNode.children) {
          updatedChildren = [...updatedChildren, ...targetNode.children];
        }
        
        const updatedParent = { [parentId]: { ...state.nodes[parentId], children: updatedChildren }};
        return { ...state, nodes: { ...state.nodes, ...updatedParent }};
      } else {
          const updatedBranch = {
          [state.selectedBranch]: {
            ...state.branches[state.selectedBranch],
            firstNode: targetNode.children[0], // FIXME: Will break if target node has several children
          },
        }
        return { ...state, branches: { ...state.branches, ...updatedBranch }};
      }
    }

    case 'DELETE_NODE': {
      const updatedNodes = { ...state.nodes };

      Object.keys(state.nodes).forEach((id) => {
        if (updatedNodes[id].children) {
          updatedNodes[id].children = state.nodes[id].children.filter(id => id != payload);
        }
      });

      const updatedSelectedChoices = {};
      const choicesToReset = Object.keys(state.selectedChoices).filter(id => state.selectedChoices[id] == payload);
      choicesToReset.forEach(id => updatedSelectedChoices[id] = null);

      delete updatedNodes[payload];
      return { ...state, nodes: updatedNodes, selectedChoices: { ...state.selectedChoices, ...updatedSelectedChoices } };
    }
    case 'SET_ACTIVE_CHOICE': {
      return { ...state, activeChoice: payload };
    }
    case 'SET_SELECTED_BRANCH': {
      return { ...state, selectedBranch: payload };
    }
    case 'SET_SELECTED_CHOICE': {
      return { ...state, selectedChoices: { ...state.selectedChoices, ...payload }};
    }
    case 'REVERT_TO_VERSION': {
      return payload;
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
