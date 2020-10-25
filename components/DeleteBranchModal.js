import { useContext } from 'react';
import { Store } from '../state/store';
import Modal from './Modal';

export default function DeleteBranchModal({ dismissAction, submitAction }) {
  const { state: { branches, selectedBranch } } = useContext(Store);
  const branchName = branches[selectedBranch].label;

  return (
    <Modal dismissAction={dismissAction} submitAction={submitAction} saveLabel="Delete">
      <h2>Do you want to delete branch “{branchName}”?</h2>
      <p>Portions of dialog may become inaccessible.</p>
    </Modal>
  );  
}
