import { useContext, useState } from 'react';
import { Store } from '../state/store';
import Field from './Field';
import Button from './Button';
import ChoiceSwitch from './ChoiceSwitch';
import ChoiceSelector from './ChoiceSelector';
import DetailsModal from './DetailsModal';
import LinkModal from './LinkModal';

export default function Node({ id, siblings }) {
  const { state, dispatch } = useContext(Store);
  const [showDetails, setShowDetails] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const node = state.nodes[id];
  const updateAction = data => dispatch({ type: 'UPDATE_NODE', payload: { ...state.nodes[id], ...data} });
  const addNodeAction = () => dispatch({ type: 'ADD_NODE', payload: { parent: id } });
  const showDetailsAction = () => setShowDetails(!showDetails);
  const addSiblingAction = () => dispatch({ type: 'ADD_NODE', payload: { parent: node.parent, redirect: false }});
  const linkToAction = () => setShowLinkModal(!showLinkModal);
  const deleteAction = () => dispatch({ type: 'DELETE_NODE', payload: id });
  const updateLinkAction = linkToNodeId => {
    const payload = { ...state.nodes[linkToNodeId], parent: [ ...state.nodes[linkToNodeId].parent, id ] };
    return dispatch({ type: 'UPDATE_NODE', payload })
  };

  if (siblings.length && state.activeChoice === node.parent) {
    return <ChoiceSelector nodeIds={siblings}/>;
  }

  return (
    <div className={`Node ${siblings.length ? 'siblings' : ''}`}>
      { node.label && <Field field="label" initialValue={node.label} updateAction={updateAction}/> }
      { siblings.length > 0 && <ChoiceSwitch count={siblings.length} parentId={node.parent}/> }
      <Field field="character" initialValue={node.character} placeholder="Character" updateAction={updateAction}/>
      <Field field="text" initialValue={node.text} placeholder="Text" updateAction={updateAction}/>
      { showDetails && <DetailsModal node={node} dismissAction={() => setShowDetails(false)} submitAction={updateAction}/> }
      { showLinkModal && <LinkModal dismissAction={() => setShowLinkModal(false)} submitAction={updateLinkAction}/> }
      <div className="actions">
        <Button action={addNodeAction} type="icon" icon="plus" title="Add Node"/>
        <Button action={linkToAction} type="icon" icon="link" title="Link To Node"/>
        { node.parent && <Button action={addSiblingAction} type="icon" icon="choice" title="Add Alternate Choice"/> }
        <Button action={deleteAction} type="icon" icon="delete" title="Delete Node"/>
        <Button action={showDetailsAction} type="icon" icon="more" title="Show Node Details"/>
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
