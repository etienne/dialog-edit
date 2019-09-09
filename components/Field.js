import { useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';

export default function Field({ initialValue, multiline, placeholder, updateAction }) {
  const [value, setValue] = useState(initialValue || '');
  const onChange = event => setValue(event.target.value);
  const onBlur = () => updateAction(value);
  
  return (
    <div>
      { multiline 
        ? <TextareaAutosize value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />
        : <input value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />
      }
      <style jsx>{`
        input, :global(textarea) {
          width: 100%;
          display: block;
          font-family: 'Fira Mono';
          font-size: 15px;
          line-height: 22px;
          border: 1px solid white;
          padding: 0;
        }

        input::placeholder, :global(textarea)::placeholder {
          color: #ccc;
        }
        
        input:hover, :global(textarea):hover {
          border: 1px solid #ccc;
        }

        input {
          text-transform: uppercase;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
