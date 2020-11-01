import { useState } from 'react';
import LabeledField from './LabeledField';
import Modal from './Modal';

export default function DetailsModal({ node, dismissAction, submitAction }) {
  const [data, setData] = useState({
    ...node,
    id: String(node.id),
    children: String(node.children),
  });
  const updateAction = newData => setData({...data, ...newData});

  return (
    <Modal dismissAction={dismissAction} submitAction={() => submitAction(data)}>
      <LabeledField field="id" initialValue={node.id} updateAction={updateAction}/>
      <LabeledField field="children" initialValue={node.children} updateAction={updateAction}/>
    </Modal>
  );
}
