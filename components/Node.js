import { useContext, useState } from 'react';
import { Store } from '../state/store';
import AddNodeButton from './AddNodeButton';
import CharacterField from './CharacterField';
import TextField from './TextField';
import ShowDetailsButton from './ShowDetailsButton';
import NodeDetails from './NodeDetails';

export default function Node({ id, character, text }) {
  const { state, dispatch } = useContext(Store);
  const [showDetails, setShowDetails] = useState(false);
  const characterUpdateAction = character => dispatch({ type: 'UPDATE_NODE_CHARACTER', payload: { id, character }});
  const textUpdateAction = text => dispatch({ type: 'UPDATE_NODE_TEXT', payload: { id, text }});
  const showDetailsAction = () => setShowDetails(!showDetails);

  return (
    <>
      <CharacterField value={character} updateAction={characterUpdateAction}/>
      <TextField value={text} updateAction={textUpdateAction}/>
      { showDetails && <NodeDetails node={state.nodes[id]}/> }
      <AddNodeButton parent={id}/>
      <ShowDetailsButton action={showDetailsAction}/>
    </>
  );
}
