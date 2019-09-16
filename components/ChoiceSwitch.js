import { useContext } from 'react';
import { Store } from '../state/store';

export default function ChoiceSwitch({ count, parent }) {
  const { dispatch } = useContext(Store);

  return (
    <button className={parent ? 'active' : 'inactive'} onClick={() => dispatch({ type: 'SET_SELECTED_CHOICE', payload: { [parent]: null } })}>
      {count}
      <img src={`/static/chevronDown.svg`} alt=""/>
      <style jsx>{`
        button {
          position: absolute;
          left: -4.5em;
          border: 1px solid #ccc;
          color: #666;
          border-radius: 5px;
          font-family: 'Cousine';
          font-size: 12px;
          line-height: 18px;
          box-shadow: -2px -2px 0 0 white, -3px -3px 0 0 #ccc;
          background-color: white;
        }

        button.active {
          cursor: pointer;
        }

        button.active:hover {
          background-color: #eee;
        }

        button.inactive {
          opacity: 0.4;
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