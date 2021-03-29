import { useContext, useState } from 'react';
import { Store } from '../state/store';
import Dialog from './Dialog';
import Button from './Button';
import VersionsModal from './VersionsModal';
import DeleteDialogModal from './DeleteDialogModal';

export default function DialogList() {
  const { state: { dialogs, selectedDialog }, dispatch } = useContext(Store);
  const [showVersions, setShowVersions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const dialogIds = Object.keys(dialogs);
  const addDialogAction = () => dispatch({ type: 'ADD_DIALOG', payload: { label: 'untitled dialog' } });
  const showVersionsAction = () => setShowVersions(true);
  const hideVersionsAction = () => setShowVersions(false);
  const showDeleteConfirmationAction = () => setShowDeleteConfirmation(true);
  const hideDeleteConfirmationAction = () => setShowDeleteConfirmation(false);
  const deleteDialogAction = () => dispatch({ type: 'DELETE_DIALOG', payload: selectedDialog });
  const revertAction = (version) => dispatch({ type: 'REVERT_TO_VERSION', payload: version });
  const selectTrashAction = () => dispatch({ type: 'SET_SELECTED_DIALOG', payload: 'trash' });

  return (
    <section>
      { dialogIds.map((id) => {
        const action = () => dispatch({ type: 'SET_SELECTED_DIALOG', payload: id });
        return <Dialog key={`dialog-${id}`} label={dialogs[id].label} selected={selectedDialog == id} action={action}/>;
      }) }
      <hr/>
      <Dialog key="trash" label="Trash" selected={selectedDialog == 'trash'} action={selectTrashAction}/>
      <div className="actions">
        <Button action={addDialogAction} type="icon" icon="plus" title="Add Dialog"/>
        <Button action={showVersionsAction} type="icon" icon="clock" title="Browse versions"/>
        { selectedDialog && selectedDialog !== 'trash' && <Button action={showDeleteConfirmationAction} type="icon" icon="delete" title="Delete Dialog"/> }
      </div>
      { showVersions && <VersionsModal submitAction={revertAction} dismissAction={hideVersionsAction}/> }
      { showDeleteConfirmation && <DeleteDialogModal submitAction={deleteDialogAction} dismissAction={hideDeleteConfirmationAction}/> }
      <style jsx>{`
        section {
          position: fixed;
          width: 29%;
          max-width: 20em;
        }

        div.actions {
          margin-top: 0.8em;
        }

        hr {
          border: 0;
          height: 0;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
}
