import Field from './Field';

export default ({ character, text }) => {
  return (
    <form>
      <Field initialValue={character}/>
      <Field initialValue={text} multiline/>
    </form>
  );
}
