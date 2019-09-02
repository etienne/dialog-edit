import CharacterField from './CharacterField';
import TextField from './TextField';

export default function Node({ character, text }) {
  return (
    <>
      <CharacterField value={character}/>
      <TextField value={text}/>
    </>
  );
}
