import Field from './Field';

export default function TextField({ value }) {
  return <Field initialValue={value} multiline placeholder="Text"/>;
}
