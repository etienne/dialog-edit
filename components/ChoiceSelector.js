import { useContext } from 'react';
import { Store } from '../state/store';
import ChoiceSwitch from './ChoiceSwitch';
import stringToColor from '../helpers/stringToColor';

export default function ChoiceSelector({ nodeIds }) {
  const { state, dispatch } = useContext(Store);
  return (
    <section>
      <ChoiceSwitch count={nodeIds.length}/>
      <div>
        { nodeIds.map(id => {
          const node = state.nodes[id];
          const payload = { [node.parent]: id };
          const color = node.character ? { style: { color: stringToColor(node.character) }} : {};

          return (
            <button key={id} onClick={() => dispatch({ type: 'SET_SELECTED_CHOICE', payload })}>
              <div className="character" {...color}>{node.character || <span>Character</span>}</div>
              <div className="text">{node.text || <span>Text</span>}</div>
            </button>
          )
        })}
      </div>
      <style jsx>{`
        section {
          position: relative;
          margin-bottom: 1em;
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
    </section>
  );
}
