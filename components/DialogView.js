import { useContext } from 'react';
import { Store } from '../state/store';
import Button from './Button';
import Content from './Content';
import Field from './Field';
import Node from './Node';

export default function DialogView({ id }) {
  if (!id) {
    return null;
  }

  const { state, dispatch } = useContext(Store);
  const { dialogs, nodes, selectedBranches } = state;
  const dialog = dialogs[id];
  const nodeIds = [];
  const branchNodes = [];
  let nodeId = dialog.firstNode;
  let childrenNodeIds;

  if (nodeId) {
    do {
      nodeIds.push(nodeId);
      childrenNodeIds = nodes[nodeId].children || [];
      if (childrenNodeIds.length > 1) {
        branchNodes.push(nodeId);
      }
    } while (childrenNodeIds.length && (nodeId = selectedBranches[nodeId] || childrenNodeIds[0]));
  }

  const updateDialog = data => dispatch({ type: 'UPDATE_DIALOG', payload: { ...dialog, ...data} });
  const addNodeAction = () => { dispatch({ type: 'ADD_NODE', payload: { dialog: id } })};

  return (
    <Content>
      <Field field="label" initialValue={dialog.label} updateAction={updateDialog}/>
      { nodeIds.length > 0
        ? nodeIds.map((id, index) => {
          const parentId = nodeIds[index - 1];
          let siblings = [];
          if (branchNodes.indexOf(parentId) !== -1) {
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
