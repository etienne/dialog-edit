import { useContext } from 'react';
import { Store } from '../state/store';
import LabeledField from './LabeledField';

export default function NodeDetails({ node }) {
  const { dispatch } = useContext(Store);
  const { id, parent, label } = node;
  const updateAction = details => dispatch({ type: 'UPDATE_NODE_DETAILS', payload: { id, parent, label, ...details} });

  return (
    <div>
      <LabeledField field="id" initialValue={id} updateAction={updateAction}/>
      <LabeledField field="parent" initialValue={parent} updateAction={updateAction}/>
      <LabeledField field="label" initialValue={label} updateAction={updateAction}/>
      <style jsx>{`
        div {
          background-color: white;
          position: absolute;
          margin: 1em 0;
          padding: 1em 0.5em;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
