import { useContext, useState } from 'react';
import { Store } from '../state/store';
import Field from './Field';
import IconButton from './IconButton';
import NodeDetails from './NodeDetails';

export default function Node({ id }) {
  const { state, dispatch } = useContext(Store);
  const [showDetails, setShowDetails] = useState(false);
  const node = state.nodes[id];
  const updateAction = data => dispatch({ type: 'UPDATE_NODE', payload: { ...state.nodes[id], ...data} });
  const addNodeAction = () => dispatch({ type: 'ADD_NODE', payload: { parent: id } });
  const showDetailsAction = () => setShowDetails(!showDetails);

  return (
    <div className="Node">
      { node.label && <Field field="label" initialValue={node.label} updateAction={updateAction}/> }
      <Field field="character" initialValue={node.character} placeholder="Character" updateAction={updateAction}/>
      <Field field="text" initialValue={node.text} placeholder="Text" updateAction={updateAction}/>
      { showDetails && <NodeDetails node={node} updateAction={updateAction}/> }
      <div className="actions">
        <IconButton action={addNodeAction} icon="plus" alt="Add Node"/>
        <IconButton action={showDetailsAction} icon="more" alt="Show Node Details"/>
      </div>
      <style jsx>{`
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
