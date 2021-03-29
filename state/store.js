import React, { useReducer } from 'react';

export const Store = React.createContext();

const initialState = {
  nodes: {},
  dialogs: {},
  selectedDialog: null,
  selectedBranches: {},
  activeBranch: null,
};

export function reducer(state, { type, payload }) {
  switch (type) {
    case 'INITIAL_LOAD': {
      return { ...state, ...payload };
    }

    case 'ADD_DIALOG': {
      const dialogId = getNewId(Object.keys(state.dialogs));
      const newDialog = { [dialogId]: { id: dialogId, ...payload } };
      let nodes = state.nodes;
      let nodeId, blankNode;

      if (!payload.firstNode) {
        nodeId = getNewId(Object.keys(state.nodes));
        blankNode = { [nodeId]: { id: nodeId } };
        newDialog[dialogId].firstNode = nodeId;
        nodes = { ...state.nodes, ...blankNode };
      }

      return { ...state, dialogs: { ...state.dialogs, ...newDialog }, nodes };
    }

    case 'ADD_NODE': {
      const id = getNewId(Object.keys(state.nodes));
      const sanitizedPayload = sanitizeNode(payload);

      const newNode = { [id]: { id, ...sanitizedPayload } };
      let selectedBranches = { ...state.selectedBranches };
      let parentNode = {};

      if (payload.dialog) {
        // Attach node to the specified dialog
        delete newNode[id].dialog;
        state.dialogs[payload.dialog].firstNode = id;
      }

      if (payload.insertAfter) {
        delete newNode[id].insertAfter;

        const parentData = { ...state.nodes[payload.insertAfter] };
        const selectedBranchFromParent = selectedBranches[payload.insertAfter];
        let newChildren;

        if (selectedBranchFromParent) {
          newChildren = parentData.children.map(c => {
            return selectedBranchFromParent === c ? id : c;
          });
          selectedBranches[id] = selectedBranchFromParent;
          delete selectedBranches[payload.insertAfter];
        } else {
          newChildren = [id];
        }

        newNode[id].children = selectedBranchFromParent ? [selectedBranchFromParent] : parentData.children;
        parentData.children = newChildren;
        parentNode = { [payload.insertAfter]: parentData };
      } else if (payload.branchFrom) {
        delete newNode[id].branchFrom;

        const parentData = { ...state.nodes[payload.branchFrom] };
        parentData.children = Array.isArray(parentData.children) ? [...parentData.children, id].sort() : [id];
        parentNode = { [payload.branchFrom]: parentData };
        selectedBranches[payload.branchFrom] = id;
      }

      return {
        ...state,
        nodes: {
          ...state.nodes,
          ...newNode,
          ...parentNode,
        },
        selectedBranches,
      };
    }

    case 'DELETE_DIALOG': {
      const updatedDialogs = { ...state.dialogs };
      delete updatedDialogs[payload];
      return { ...state, dialogs: updatedDialogs, selectedDialog: null };
    }

    case 'UPDATE_DIALOG': {
      const { id } = payload;
      const updatedDialog = { [id]: { ...state.dialogs[id], ...payload } };
      return { ...state, dialogs: { ...state.dialogs, ...updatedDialog }};
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
        const childrenOfParent = state.nodes[parentId].children;
        
        if (!childrenOfParent.includes(targetNode.id)) {
          return state;          
        }

        let updatedChildren = state.nodes[parentId].children.filter(c => c != payload.id);

        if (targetNode.children) {
          const selectedBranchForTargetNode = state.selectedBranches[targetNode.id];

          if (selectedBranchForTargetNode) {
            updatedChildren = [...updatedChildren, ...targetNode.children.filter(c => c == selectedBranchForTargetNode)];
          } else {
            updatedChildren = [...updatedChildren, ...targetNode.children];
          }
        }

        let selectedBranches = state.selectedBranches;

        if (selectedBranches[parentId] && updatedChildren.length) {
          selectedBranches[parentId] = updatedChildren[0];
        }
        
        const updatedParent = { [parentId]: { ...state.nodes[parentId], children: updatedChildren }};
        return { ...state, nodes: { ...state.nodes, ...updatedParent }, selectedBranches};
      } else {
          const updatedDialog = {
          [state.selectedDialog]: {
            ...state.dialogs[state.selectedDialog],
            firstNode: targetNode.children[0], // FIXME: Will break if target node has several children
          },
        }
        return { ...state, dialogs: { ...state.dialogs, ...updatedDialog }};
      }
    }

    case 'DELETE_NODE': {
      const updatedNodes = { ...state.nodes };

      Object.keys(state.nodes).forEach((id) => {
        if (updatedNodes[id].children) {
          updatedNodes[id].children = state.nodes[id].children.filter(id => id != payload);
        }
      });

      const updatedselectedBranches = {};
      const branchesToReset = Object.keys(state.selectedBranches).filter(id => state.selectedBranches[id] == payload);
      branchesToReset.forEach(id => updatedselectedBranches[id] = null);

      delete updatedNodes[payload];
      return { ...state, nodes: updatedNodes, selectedBranches: { ...state.selectedBranches, ...updatedselectedBranches } };
    }
    case 'SET_ACTIVE_BRANCH': {
      return { ...state, activeBranch: payload };
    }
    case 'SET_SELECTED_DIALOG': {
      return { ...state, selectedDialog: payload };
    }
    case 'SET_SELECTED_BRANCH': {
      return { ...state, selectedBranches: { ...state.selectedBranches, ...payload }};
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
