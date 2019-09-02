import { useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';

export default function Field({ initialValue, multiline }) {
  const [value, setValue] = useState(initialValue);
  
  return (
    <div>
      { multiline 
        ? <TextareaAutosize value={value} onChange={() => setValue(event.target.value)} />
        : <input value={value} onChange={() => setValue(event.target.value)} />
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
