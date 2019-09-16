export default function ChoiceSwitch({ count }) {
  return (
    <button>
      {count}
      <img src={`/static/chevronDown.svg`} alt=""/>
      <style jsx>{`
        button {
          position: absolute;
          left: -4.5em;
          top: -0.2em;
          border: 1px solid #ccc;
          color: #666;
          border-radius: 5px;
          font-family: 'Cousine';
          font-size: 12px;
          line-height: 18px;
          box-shadow: -2px -2px 0 0 white, -3px -3px 0 0 #ccc;
          cursor: pointer;
          background-color: white;
        }

        button:hover {
          background-color: #eee;
        }

        button img {
          position: relative;
          left: 1px;
          top: 3px;
        }
      `}</style>
    </button>
  );
}
