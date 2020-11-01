import { useContext } from 'react';
import { Store } from '../state/store';
import Content from './Content';
import Node from './Node';

export default function DeletedNodes() {
  const { state } = useContext(Store);
  const { nodes, branches } = state;

  const allNodeIds = Object.keys(nodes).map(id => Number(id));
  const rootNodeIds = Object.keys(branches).map(id => branches[id].firstNode);
  let activeNodeIds = rootNodeIds;
  let previousActiveNodeIds = activeNodeIds;

  do {
    previousActiveNodeIds = activeNodeIds;
    activeNodeIds.forEach((id) => {
      if (nodes[id].children) {
        activeNodeIds = [...activeNodeIds, ...nodes[id].children];
      }
    })
    activeNodeIds = [...new Set(activeNodeIds)];
  } while (activeNodeIds.length !== previousActiveNodeIds.length);

  const deletedNodes = allNodeIds.filter(id => activeNodeIds.indexOf(id) === -1);

  return (
    <Content>
      <h1>Trash</h1>
      { deletedNodes.map(id => {
        return <Node key={id} id={id} permanentDelete/>
      }) }
      <style jsx>{`
        h1 {
          font-weight: normal;
          font-size: 2em;
          line-height: 24px;
          margin: 0.8em 0;
        }
      `}</style>
    </Content>
  );
}
