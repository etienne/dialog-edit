import { useContext, useState } from 'react';
import { Store } from '../state/store';
import Field from './Field';
import IconButton from './IconButton';
import NodeDetails from './NodeDetails';

export default function Node({ id, hasAdjacentChoices }) {
  const { state, dispatch } = useContext(Store);
  const [showDetails, setShowDetails] = useState(false);
  const node = state.nodes[id];
  const updateAction = data => dispatch({ type: 'UPDATE_NODE', payload: { ...state.nodes[id], ...data} });
  const addNodeAction = () => dispatch({ type: 'ADD_NODE', payload: { parent: id } });
  const showDetailsAction = () => setShowDetails(!showDetails);
  const addChoiceAction = () => dispatch({ type: 'ADD_NODE', payload: { parent: node.parent, redirect: false }});

  return (
    <div className={`Node ${hasAdjacentChoices ? 'choices' : ''}`}>
      { node.label && <Field field="label" initialValue={node.label} updateAction={updateAction}/> }
      <Field field="character" initialValue={node.character} placeholder="Character" updateAction={updateAction}/>
      <Field field="text" initialValue={node.text} placeholder="Text" updateAction={updateAction}/>
      { showDetails && <NodeDetails node={node} updateAction={updateAction}/> }
      <div className="actions">
        <IconButton action={addNodeAction} icon="plus" alt="Add Node"/>
        <IconButton action={showDetailsAction} icon="more" alt="Show Node Details"/>
        { node.parent && <IconButton action={addChoiceAction} icon="choice" alt="Add Alternate Choice"/> }
      </div>
      <style jsx>{`
        div.Node.choices {
          border: 1px solid #ddd;
          padding: 1em;
          margin: 0 0 0 -1em;
          position: relative;
        }
        
        div.Node.choices:after {
          content: '';
          display: block;
          position: absolute;
          left: -1px;
          right: -1px;
          bottom: -0.6em;
          height: 0.5em;
          border-width: 1px;
          border-color: white #ddd #ddd;
          border-style: solid;
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
