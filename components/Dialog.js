import { useContext } from 'react';
import { Store } from '../state/store';
import Field from './Field';
import Node from './Node';

export default function Dialog({ branchId }) {
  if (!branchId) {
    return null;
  }

  const { state, dispatch } = useContext(Store);
  const { branches, nodes, selectedChoices } = state;
  const branch = branches[branchId];
  const nodeIds = [];
  const choiceNodes = [];
  let nodeId = branch.firstNode;
  let childrenNodeIds;

  function getChildrenNodeIds(id) {
    return Object.keys(nodes).filter(nodeId => {
      const parent = nodes[nodeId].parent;
      return typeof parent === 'object' ? parent.indexOf(id) !== -1 : parent == id;
    });
  }

  if (nodeId) {
    do {
      nodeIds.push(nodeId);
      childrenNodeIds = getChildrenNodeIds(nodeId);
      if (childrenNodeIds.length > 1) {
        choiceNodes.push(nodeId);
      }
    } while (childrenNodeIds.length && (nodeId = selectedChoices[nodeId] || childrenNodeIds[0]));
  }

  const updateBranch = data => dispatch({ type: 'UPDATE_BRANCH', payload: { ...branch, ...data} });
  
  return (
    <section>
      <Field field="label" initialValue={branch.label} updateAction={updateBranch}/>
      { nodeIds.length > 0 && nodeIds.map((id) => {
        const parentId = nodes[id].parent;
        let siblings = [];
        if (choiceNodes.indexOf(parentId) !== -1) {
          siblings = getChildrenNodeIds(parentId);
        }
        return <Node key={id} id={id} siblings={siblings}/>
      }) }
      <style jsx>{`
        section {
          padding-left: 3em;
          grid-area: content;
        }
      `}</style>
    </section>
  );
}
