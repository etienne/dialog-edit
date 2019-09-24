import { useState } from 'react';
import LabeledField from './LabeledField';
import Modal from './Modal';

export default function LinkModal({ dismissAction, submitAction }) {
  const [link, setLink] = useState();
  const updateAction = linkData => setLink(linkData.linkTo);

  return (
    <Modal dismissAction={dismissAction} submitAction={() => submitAction(link)}>
      <LabeledField field="linkTo" updateAction={updateAction}/>
    </Modal>
  );  
}
