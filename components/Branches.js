import { useContext } from 'react';
import { Store } from '../state/store';
import Branch from './Branch';
import IconButton from './IconButton';

export default function Branches() {
  const { state, dispatch } = useContext(Store);
  const branchIds = Object.keys(state.nodes).filter(node => !!state.nodes[node].label);
  const addNodeAction = () => dispatch({ type: 'ADD_NODE', payload: { label: 'untitled branch' } });

  return (
    <section>
      { branchIds.map((id) => {
        const action = () => dispatch({ type: 'SET_SELECTED_BRANCH', payload: id });
        return <Branch key={`branch-${id}`} label={state.nodes[id].label} selected={state.selectedBranch == id} action={action}/>;
      }) }
      <div className="actions">
        <IconButton action={addNodeAction} icon="plus" alt="Add Branch"/>
      </div>
      <style jsx>{`
        section {
          flex: 1 25%;
          padding-right: 2em;
          max-width: 20em;
        }

        div.actions {
          margin-top: 0.8em;
        }
      `}</style>
    </section>
  );
}
