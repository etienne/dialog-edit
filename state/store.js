import React, { useReducer } from 'react';

export const Store = React.createContext();

const initialState = {
  nodes: {},
  dialogs: {},
  selectedDialog: null,
  selectedChoices: {},
  activeChoice: null,
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
      let selectedChoices = { ...state.selectedChoices };
      let parentNode = {};

      if (payload.dialog) {
        // Attach node to the specified dialog
        delete newNode[id].dialog;
        state.dialogs[payload.dialog].firstNode = id;
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
          const selectedChoiceForTargetNode = state.selectedChoices[targetNode.id];

          if (selectedChoiceForTargetNode) {
            updatedChildren = [...updatedChildren, ...targetNode.children.filter(c => c == selectedChoiceForTargetNode)];
          } else {
            updatedChildren = [...updatedChildren, ...targetNode.children];
          }
        }

        let selectedChoices = state.selectedChoices;

        if (selectedChoices[parentId] && updatedChildren.length) {
          selectedChoices[parentId] = updatedChildren[0];
        }
        
        const updatedParent = { [parentId]: { ...state.nodes[parentId], children: updatedChildren }};
        return { ...state, nodes: { ...state.nodes, ...updatedParent }, selectedChoices};
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

      const updatedSelectedChoices = {};
      const choicesToReset = Object.keys(state.selectedChoices).filter(id => state.selectedChoices[id] == payload);
      choicesToReset.forEach(id => updatedSelectedChoices[id] = null);

      delete updatedNodes[payload];
      return { ...state, nodes: updatedNodes, selectedChoices: { ...state.selectedChoices, ...updatedSelectedChoices } };
    }
    case 'SET_ACTIVE_CHOICE': {
      return { ...state, activeChoice: payload };
    }
    case 'SET_SELECTED_DIALOG': {
      return { ...state, selectedDialog: payload };
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
