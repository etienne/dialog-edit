import { useContext } from 'react';
import { Store } from '../state/store';
import Branches from './Branches';
import Dialog from './Dialog';
import CharacterList from './CharacterList';

export default function App() {
  const { state } = useContext(Store);

  return (
    <div>
      <Branches/>
      <Dialog rootId={state.selectedBranch}/>
      <CharacterList/>
      <style jsx>{`
        div {
          display: flex;
          width: 100%;
        }
      `}</style>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Cousine&display=swap');
      
        body, button, input {
          font-family: 'Cousine';
          font-size: 15px;
          line-height: 22px;
        }

        button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
        }

        input:focus, textarea:focus {
          outline-color: #aaa;
        }

        body {
          margin: 2em;
          padding: 0;
        }
      `}</style>
    </div>
  )
}
