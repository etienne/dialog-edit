import getConfig from 'next/config';
import { useContext, useEffect } from 'react';
import { Store } from '../state/store';
import BranchList from './BranchList';
import Dialog from './Dialog';
import CharacterList from './CharacterList';

const { publicRuntimeConfig } = getConfig();

export default function App() {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    if (process.browser) {
      fetch(publicRuntimeConfig.serverEndpoint + '/store').then(res => res.json()).then(json => {
        dispatch({ type: 'INITIAL_LOAD', payload: json });
      });
    }
  }, []);

  useEffect(() => {
    if (process.browser) {
      fetch(publicRuntimeConfig.serverEndpoint + '/store', {
        method: 'POST',
        body: JSON.stringify(state),
        headers: { 'Content-Type': 'application/json' },
      }).catch(error => console.error('Error:', error));
    }
  }, [state]);

  return (
    <div>
      <BranchList/>
      <Dialog branchId={state.selectedBranch}/>
      <CharacterList/>
      <style jsx>{`
        div {
          display: grid;
          grid-template-columns: 31% auto;
          grid-template-areas: "sidebar content";
          grid-column-gap: 3%;
          max-width: 64em;
        }
      `}</style>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Cousine&display=swap');

        h2 {
          line-height: 1.4;
        }
      
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
