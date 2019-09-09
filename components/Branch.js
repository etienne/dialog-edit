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
          font-family: 'Cousine';
          font-size: 15px;
          line-height: 22px;
          padding: 0.3em;
        }

        button.selected {
          background-color: #eee;
        }
      `}</style>
    </button>
  );
}
