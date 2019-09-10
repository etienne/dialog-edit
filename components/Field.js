import { useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import stringToColor from '../helpers/stringToColor';

export default function Field({ initialValue, field, placeholder, updateAction }) {
  const [value, setValue] = useState(initialValue || '');
  const onChange = event => setValue(event.target.value);
  const onBlur = () => updateAction({ [field]: value });
  
  return (
    <>
      { field == 'text'
        ? <TextareaAutosize value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />
        : <input className={field} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />
      }
      <style jsx>{`
        input, :global(textarea) {
          width: 100%;
          display: block;
          font-family: 'Cousine';
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

        input.character {
          text-transform: uppercase;
          font-size: 13px;
        }
        
        input.character:not(:focus) {
          color: ${stringToColor(value)};
        }
        
        input.label {
          font-size: 2em;
          margin: 0.8em 0;
        }
      `}</style>
    </>
  );
}
