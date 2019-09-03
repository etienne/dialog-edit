import Dialog from '../components/Dialog';
import { useState } from 'react';

export default function Index() {
  const [nodes, setNodes] = useState([{ id: 1 }]);
  const [lastId, setLastId] = useState(1);
  
  function addNode(parent) {
    const id = getNextId();
    setNodes([...nodes, { parent, id }]);
    setLastId(id);
  }
  
  function getNextId() {
    return lastId + 1;
  }
  
  return (
    <div>
      <Dialog nodes={nodes} addNode={addNode}/>
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
  );
};

