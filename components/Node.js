import { useContext } from 'react';
import { Store } from '../state/store';
import AddNodeButton from './AddNodeButton';
import CharacterField from './CharacterField';
import TextField from './TextField';

export default function Node({ id, character, text }) {
  const { state, dispatch } = useContext(Store);
  const characterUpdateAction = (character) => dispatch({ type: 'UPDATE_NODE_CHARACTER', payload: { id, character }});
  const textUpdateAction = (text) => dispatch({ type: 'UPDATE_NODE_TEXT', payload: { id, text }});

  return (
    <>
      <CharacterField value={character} updateAction={characterUpdateAction}/>
      <TextField value={text} updateAction={textUpdateAction}/>
      <AddNodeButton parent={id}/>
    </>
  );
}
