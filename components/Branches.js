import { useContext } from 'react';
import { Store } from '../state/store';
import Branch from './Branch';

export default function Branches() {
  const { state } = useContext(Store);
  const branchIds = Object.keys(state.nodes).filter(node => !!state.nodes[node].label);

  return (
    <section>
      { branchIds.map(id => <Branch key={`branch-${id}`} label={state.nodes[id].label}/>) }
      <style jsx>{`
        section {
          flex: 1 25%;
        }
      `}</style>
    </section>
  );
}
