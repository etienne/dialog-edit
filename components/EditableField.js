import { useState } from 'react';

function Label({ action, value }) {
  return (
    <div onClick={action}>
      { value }
      <style jsx>{`
        div {
          border: 1px solid white;
          padding: 0.2em;
        }
      `}</style>
    </div>
  );
}

function Field({ action, value, setValue }) {
  return (
    <form onSubmit={action}>
      <input value={value} onChange={() => setValue(event.target.value)} />
      <style jsx>{`
        input {
          width: 100%;
          display: block;
          font-family: 'Fira Mono';
          font-size: 15px;
          line-height: 22px;
          border: 1px solid #ddd;
          padding: 0.2em;
        }
      `}</style>
    </form>
  );
}

export default function EditableField({ initialValue }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  
  return (
    <div>
      { editing
        ? <Field action={() => setEditing(false)} value={value} setValue={setValue} />
        : <Label action={() => setEditing(true)} value={value} />
      }
    </div>
  );
}
