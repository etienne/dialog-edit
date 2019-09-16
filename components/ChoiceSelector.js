import { useContext } from 'react';
import { Store } from '../state/store';
import ChoiceSwitch from './ChoiceSwitch';

export default function ChoiceSelector({ nodeIds }) {
  const { state, dispatch } = useContext(Store);
  return (
    <div>
      <ChoiceSwitch count={nodeIds.length}/>
      <div>
        { nodeIds.map(id => {
          const node = state.nodes[id];
          const payload = { [node.parent]: id };

          return (
            <button key={id} onClick={() => dispatch({ type: 'SET_SELECTED_CHOICE', payload })}>
              <div className="character">{node.character || <span>Character</span>}</div>
              <div className="text">{node.text || <span>Text</span>}</div>
            </button>
          )
        })}
      </div>
      <style jsx>{`
        div {
          position: relative;
        }

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
