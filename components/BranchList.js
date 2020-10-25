import { useContext, useState } from 'react';
import { Store } from '../state/store';
import Branch from './Branch';
import Button from './Button';
import VersionsModal from './VersionsModal';
import DeleteBranchModal from './DeleteBranchModal';

export default function BranchList() {
  const { state: { branches, selectedBranch }, dispatch } = useContext(Store);
  const [showVersions, setShowVersions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const branchIds = Object.keys(branches);
  const addBranchAction = () => dispatch({ type: 'ADD_BRANCH', payload: { label: 'untitled branch' } });
  const showVersionsAction = () => setShowVersions(true);
  const hideVersionsAction = () => setShowVersions(false);
  const showDeleteConfirmationAction = () => setShowDeleteConfirmation(true);
  const hideDeleteConfirmationAction = () => setShowDeleteConfirmation(false);
  const deleteBranchAction = () => dispatch({ type: 'DELETE_BRANCH', payload: selectedBranch });
  const revertAction = (version) => dispatch({ type: 'REVERT_TO_VERSION', payload: version });

  return (
    <section>
      { branchIds.map((id) => {
        const action = () => dispatch({ type: 'SET_SELECTED_BRANCH', payload: id });
        return <Branch key={`branch-${id}`} label={branches[id].label} selected={selectedBranch == id} action={action}/>;
      }) }
      <div className="actions">
        <Button action={addBranchAction} type="icon" icon="plus" title="Add Branch"/>
        <Button action={showVersionsAction} type="icon" icon="clock" title="Browse versions"/>
        { selectedBranch && <Button action={showDeleteConfirmationAction} type="icon" icon="delete" title="Delete Branch"/> }
      </div>
      { showVersions && <VersionsModal submitAction={revertAction} dismissAction={hideVersionsAction}/> }
      { showDeleteConfirmation && <DeleteBranchModal submitAction={deleteBranchAction} dismissAction={hideDeleteConfirmationAction}/> }
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
