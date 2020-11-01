import { useContext, useState } from 'react';
import { Store } from '../state/store';
import Field from './Field';
import Button from './Button';
import ChoiceSwitch from './ChoiceSwitch';
import ChoiceSelector from './ChoiceSelector';
import DetailsModal from './DetailsModal';
import LinkModal from './LinkModal';

export default function Node({ id, siblings, parentId, permanentDelete }) {
  const { state, dispatch } = useContext(Store);
  const [showDetails, setShowDetails] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const node = state.nodes[id];
  const updateAction = (data) => {
    const children = data.children && data.children.split(',');
    dispatch({ type: 'UPDATE_NODE', payload: { ...state.nodes[id], ...data, children }});
  };
  const addNodeAction = () => dispatch({ type: 'ADD_NODE', payload: { insertAfter: id } });
  const showDetailsAction = () => setShowDetails(!showDetails);
  const addSiblingAction = () => dispatch({ type: 'ADD_NODE', payload: { branchFrom: parentId }});
  const permanentDeleteAction = () => dispatch({ type: 'DELETE_NODE', payload: id });
  const softDeleteAction = () => dispatch({ type: 'SOFT_DELETE_NODE', payload: { id, detachFrom: parentId }});
  const deleteAction = permanentDelete ? permanentDeleteAction : softDeleteAction;
  const deleteTitle = permanentDelete ? 'Delete node permanently' : 'Move node to trash';

  if (siblings.length && state.activeChoice === parentId) {
    return <ChoiceSelector nodeIds={siblings} parentId={parentId}/>;
  }

  return (
    <div className={`Node ${siblings.length ? 'siblings' : ''}`}>
      { node.label && <Field field="label" initialValue={node.label} updateAction={updateAction}/> }
      { siblings.length > 0 && <ChoiceSwitch count={siblings.length} parentId={parentId}/> }
      <Field field="character" initialValue={node.character} placeholder="Character" updateAction={updateAction}/>
      <Field field="text" initialValue={node.text} placeholder="Text" updateAction={updateAction}/>
      { showDetails && <DetailsModal node={node} dismissAction={() => setShowDetails(false)} submitAction={updateAction}/> }
      { showLinkModal && <LinkModal dismissAction={() => setShowLinkModal(false)} submitAction={updateLinkAction}/> }
      <div className="actions">
        <Button action={addNodeAction} type="icon" icon="plus" title="Add node"/>
        { parentId && <Button action={addSiblingAction} type="icon" icon="choice" title="Add alternate choice"/> }
        <Button action={deleteAction} type="icon" icon="delete" title={deleteTitle}/>
        <Button action={showDetailsAction} type="icon" icon="more" title="Show node details"/>
      </div>
      <style jsx>{`
        div.Node {
          position: relative;
        }

        div.Node:first-child  {
          margin-top: -0.5em;
        }

        div.actions {
          opacity: 0.5;
          visibility: hidden;
        }

        div.Node:last-child div.actions {
          margin-top: 1em;
          opacity: 1;
          visibility: visible;
        }

        div:hover div.actions {
          visibility: visible;
        }
      `}</style>
    </div>
  );
}

Node.defaultProps = {
  siblings: [],
}
