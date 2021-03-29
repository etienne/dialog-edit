export default function Dialog({ label, selected, action }) {
  return (
    <button onClick={action} className={selected ? 'selected' : ''}>
      {label}
      <style jsx>{`
        button {
          width: 100%;
          text-align: left;
          display: block;
          border: none;
          border-radius: 5px;
          padding: 0.3em 0.6em;
          cursor: pointer;
          background-color: transparent;
        }

        button:hover {
          background-color: rgba(0,0,0,0.06);
        }

        button.selected {
          background-color: rgba(0,0,0,0.1);
        }
      `}</style>
    </button>
  );
}
