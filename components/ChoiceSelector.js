import { useContext } from 'react';
import { Store } from '../state/store';

export default function ChoiceSelector({ nodeIds }) {
  const { state } = useContext(Store);
  return (
    <div>
      { nodeIds.map(id => {
        const node = state.nodes[id];
        console.log('node=', node);        

        return (
          <button key={id}>
            <div className="character">{node.character || <span>Character</span>}</div>
            <div className="text">{node.text || <span>Text</span>}</div>
          </button>
        )
      })}
      <style jsx>{`
        button {
          display: block;
          width: 100%;
          text-align: left;
          border: 1px solid #ccc;
          border-bottom-width: 0;
          font-family: 'Cousine';
          font-size: 15px;
          line-height: 22px;
          padding: 1em;
          cursor: pointer;
        }

        button:first-child {
          border-radius: 5px 5px 0 0;
        }

        button:last-child {
          border-bottom-width: 1px;
          border-radius: 0 0 5px 5px;
        }

        button:hover {
          background-color: #eee;
        }

        div.character {
          text-transform: uppercase;
          font-size: 13px;
        }

        span {
          color: #ccc;
        }
      `}</style>
    </div>
  );
}
