import Field from './Field';

export default function TextField({ value, updateAction }) {
  return <Field initialValue={value} multiline placeholder="Text" updateAction={updateAction}/>;
}
