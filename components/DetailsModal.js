import { useState } from 'react';
import LabeledField from './LabeledField';
import Modal from './Modal';

export default function DetailsModal({ node, dismissAction, submitAction }) {
  const [data, setData] = useState({});
  const updateAction = newData => setData({...data, ...newData});

  return (
    <Modal dismissAction={dismissAction} submitAction={() => submitAction(data)}>
      <LabeledField field="id" initialValue={node.id} updateAction={updateAction}/>
      <LabeledField field="parent" initialValue={node.parent} updateAction={updateAction}/>
    </Modal>
  );
}
