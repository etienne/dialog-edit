import Field from './Field';

export default function CharacterField({ value, updateAction }) {
  return <Field initialValue={value} placeholder="Character" updateAction={updateAction}/>;
}
