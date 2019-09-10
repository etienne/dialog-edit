import { useContext, useState } from 'react';
import { Store } from '../state/store';
import AddNodeButton from './AddNodeButton';
import Field from './Field';
import ShowDetailsButton from './ShowDetailsButton';
import NodeDetails from './NodeDetails';

export default function Node({ id }) {
  const { state, dispatch } = useContext(Store);
  const [showDetails, setShowDetails] = useState(false);
  const node = state.nodes[id];
  const showDetailsAction = () => setShowDetails(!showDetails);
  const updateAction = data => dispatch({ type: 'UPDATE_NODE', payload: { ...state.nodes[id], ...data} });

  return (
    <div className="Node">
      { node.label && <Field field="label" initialValue={node.label} updateAction={updateAction}/> }
      <Field field="character" initialValue={node.character} placeholder="Character" updateAction={updateAction}/>
      <Field field="text" initialValue={node.text} placeholder="Text" updateAction={updateAction}/>
      { showDetails && <NodeDetails node={node} updateAction={updateAction}/> }
      <div className="actions">
        <AddNodeButton parent={id}/>
        <ShowDetailsButton action={showDetailsAction}/>
      </div>
      <style jsx>{`
        div:first-child h1 {
          margin-top: 0.5em;
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
