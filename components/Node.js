import AddNodeButton from './AddNodeButton';
import CharacterField from './CharacterField';
import TextField from './TextField';

export default function Node({ id, character, text }) {
  return (
    <>
      <CharacterField value={character}/>
      <TextField value={text}/>
      <AddNodeButton parent={id}/>
    </>
  );
}
