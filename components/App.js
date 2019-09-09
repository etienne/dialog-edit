import { useContext } from 'react';
import { Store } from '../state/store';
import Branches from '../components/Branches';
import Dialog from '../components/Dialog';

export default function App() {
  const { state } = useContext(Store);

  return (
    <div>
      <Branches/>
      <Dialog rootId={state.selectedBranch}/>
      <style jsx>{`
        div {
          display: flex;
          width: 100%;
        }
      `}</style>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Cousine&display=swap');
      
        body {
          font-family: 'Cousine';
          font-size: 15px;
          line-height: 22px;
          margin: 2em;
          padding: 0;
        }
      `}</style>
    </div>
  )
}
