import { useContext } from 'react';
import { Store } from '../state/store';
import Modal from './Modal';

export default function DeleteDialogModal({ dismissAction, submitAction }) {
  const { state: { dialogs, selectedDialog } } = useContext(Store);
  const dialogName = dialogs[selectedDialog].label;

  return (
    <Modal dismissAction={dismissAction} submitAction={submitAction} saveLabel="Delete">
      <h2>Do you want to delete dialog “{dialogName}”?</h2>
      <p>The dialog will be moved to the trash.</p>
    </Modal>
  );  
}
