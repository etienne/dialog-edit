import AddNodeButton from './AddNodeButton';
import CharacterField from './CharacterField';
import TextField from './TextField';

export default function Node({ id, character, text, addNode }) {
  return (
    <>
      <CharacterField value={character}/>
      <TextField value={text}/>
      <AddNodeButton onClick={() => addNode(id)}/>
    </>
  );
}
