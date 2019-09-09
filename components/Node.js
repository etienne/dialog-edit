import { useContext, useState } from 'react';
import { Store } from '../state/store';
import AddNodeButton from './AddNodeButton';
import CharacterField from './CharacterField';
import TextField from './TextField';
import ShowDetailsButton from './ShowDetailsButton';
import NodeDetails from './NodeDetails';

export default function Node({ id }) {
  const { state, dispatch } = useContext(Store);
  const [showDetails, setShowDetails] = useState(false);
  const node = state.nodes[id];
  const characterUpdateAction = character => dispatch({ type: 'UPDATE_NODE_CHARACTER', payload: { id, character }});
  const textUpdateAction = text => dispatch({ type: 'UPDATE_NODE_TEXT', payload: { id, text }});
  const showDetailsAction = () => setShowDetails(!showDetails);

  return (
    <div className="Node">
      { node.label && <h1>{node.label}</h1> }
      <CharacterField value={node.character} updateAction={characterUpdateAction}/>
      <TextField value={node.text} updateAction={textUpdateAction}/>
      { showDetails && <NodeDetails node={state.nodes[id]}/> }
      <div className="actions">
        <AddNodeButton parent={id}/>
        <ShowDetailsButton action={showDetailsAction}/>
      </div>
      <style jsx>{`
        h1 {
          font-size: 2em;
        }

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
