import { useState } from 'react';

export default function LabeledField({ field, initialValue, updateAction }) {
  const [value, setValue] = useState(initialValue || '');
  const onChange = event => setValue(event.target.value);
  const onBlur = () => updateAction({ [field]: value });

  return (
    <div>
      <label>{field}</label>
      <input value={value} onChange={onChange} onBlur={onBlur}/>
      <style jsx>{`
        div {
          display: flex;
          flex: 1 auto;
          padding: 1em;
        }

        label {
          flex: 1 30%;
          padding: 0.2em 1em 0 0;
          font-size: 13px;
          color: #999;
          text-align: right;
        }

        input {
          flex: 1 70%;
          font-family: 'Fira Mono';
          font-size: 15px;
          line-height: 22px;
          border: 1px solid ddd;
        }
      `}</style>
    </div>
  );
}
