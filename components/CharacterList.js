import { useContext } from 'react';
import { Store } from '../state/store';

export default function CharacterList() {
  const { state } = useContext(Store);
  const characters = Object.keys(state.nodes).map(id => state.nodes[id].character).filter(name => !!name);
  const uniqueCharacters = [...new Set(characters)];
  
  return (
    <datalist id="characters">
      { uniqueCharacters.map(character => <option key={character} value={character}/>) }
    </datalist>
  );
}
