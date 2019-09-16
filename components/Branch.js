export default function Branch({ label, selected, action }) {
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
        }

        button.selected {
          background-color: #eee;
        }
      `}</style>
    </button>
  );
}
