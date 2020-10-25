import { useContext, useState } from 'react';
import { Store } from '../state/store';
import Branch from './Branch';
import Button from './Button';
import VersionsModal from './VersionsModal';

export default function BranchList() {
  const { state: { branches, selectedBranch }, dispatch } = useContext(Store);
  const [showVersions, setShowVersions] = useState(false);
  const branchIds = Object.keys(branches);
  const addNodeAction = () => dispatch({ type: 'ADD_BRANCH', payload: { label: 'untitled branch' } });
  const showVersionsAction = () => setShowVersions(true);
  const hideVersionsAction = () => setShowVersions(false);
  const revertAction = (version) => dispatch({ type: 'REVERT_TO_VERSION', payload: version });

  return (
    <section>
      { branchIds.map((id) => {
        const action = () => dispatch({ type: 'SET_SELECTED_BRANCH', payload: id });
        return <Branch key={`branch-${id}`} label={branches[id].label} selected={selectedBranch == id} action={action}/>;
      }) }
      <div className="actions">
        <Button action={addNodeAction} type="icon" icon="plus" title="Add Branch"/>
        <Button action={showVersionsAction} type="icon" icon="clock" title="Browse versions"/>
      </div>
      { showVersions && <VersionsModal submitAction={revertAction} dismissAction={hideVersionsAction}/> }
      <style jsx>{`
        section {
          position: fixed;
          width: 29%;
          max-width: 20em;
        }

        div.actions {
          margin-top: 0.8em;
        }
      `}</style>
    </section>
  );
}
