import { useContext } from 'react';
import { Store } from '../state/store';

export default function Branches() {
  const { state } = useContext(Store);
  const branchIds = Object.keys(state.nodes).filter(node => !!state.nodes[node].label);

  return (
    <section>
      { branchIds.map(id => <div key={`branch-${id}`}>{state.nodes[id].label}</div>) }
      <style jsx>{`
        section {
          flex: 1 25%;
        }
      `}</style>
    </section>
  );
}
