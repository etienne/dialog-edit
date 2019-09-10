import { useContext } from 'react';
import { Store } from '../state/store';
import LabeledField from './LabeledField';

export default function NodeDetails({ node, updateAction }) {
  const { state, dispatch } = useContext(Store);

  return (
    <div>
      <LabeledField field="id" initialValue={node.id} updateAction={updateAction}/>
      <LabeledField field="parent" initialValue={node.parent} updateAction={updateAction}/>
      <LabeledField field="label" initialValue={node.label} updateAction={updateAction}/>
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
