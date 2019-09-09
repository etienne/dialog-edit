import { useContext } from 'react';
import { Store } from '../state/store';
import Dialog from '../components/Dialog';

export default function App() {
  const { state, dispatch } = useContext(Store);
  console.log('satte', state);
  
  // function addNode(parent) {
  //   const id = getNextId();
  //   const newNode = { [id]: { id, parent } };
  //   setNodes({...nodes, ...newNode});
  //   setLastId(id);
  // }
  //
  // function getNextId() {
  //   return lastId + 1;
  // }

  return (
    <div>
      <Dialog nodes={state.nodes}/>
      <style jsx>{`
        div {
          max-width: 50em;
          margin: 0 auto;
        }
      `}</style>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Fira+Mono&display=swap');
      
        body {
          font-family: 'Fira Mono';
          font-size: 15px;
          line-height: 22px;
          margin: 2em;
          padding: 0;
        }
      `}</style>
    </div>
  )
}
