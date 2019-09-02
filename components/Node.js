import CharacterField from './CharacterField';
import TextField from './TextField';

export default ({ character, text }) => {
  return (
    <form>
      <CharacterField value={character}/>
      <TextField value={text}/>
    </form>
  );
}
