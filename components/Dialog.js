import { useContext } from 'react';
import { Store } from '../state/store';
import Button from './Button';
import Content from './Content';
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

  if (nodeId) {
    do {
      nodeIds.push(nodeId);
      childrenNodeIds = nodes[nodeId].children || [];
      if (childrenNodeIds.length > 1) {
        choiceNodes.push(nodeId);
      }
    } while (childrenNodeIds.length && (nodeId = selectedChoices[nodeId] || childrenNodeIds[0]));
  }

  const updateBranch = data => dispatch({ type: 'UPDATE_BRANCH', payload: { ...branch, ...data} });
  const addNodeAction = () => { dispatch({ type: 'ADD_NODE', payload: { branch: branchId } })};

  return (
    <Content>
      <Field field="label" initialValue={branch.label} updateAction={updateBranch}/>
      { nodeIds.length > 0
        ? nodeIds.map((id, index) => {
          const parentId = nodeIds[index - 1];
          let siblings = [];
          if (choiceNodes.indexOf(parentId) !== -1) {
            siblings = nodes[parentId].children;
          }
          return <Node key={id} id={id} siblings={siblings} parentId={parentId}/>;
        })
        : (
          <div className="actions">
            <Button action={addNodeAction} type="icon" icon="plus" title="Add Node"/>
          </div>
        )
      }
    </Content>
  );
}
