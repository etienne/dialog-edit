import { useContext } from 'react';
import { Store } from '../state/store';
import Node from './Node';

export default function Dialog({ rootId }) {
  const { state } = useContext(Store);
  const nodeIds = [];
  const choiceNodes = [];
  let nodeId = rootId;
  let childrenNodeIds;

  function getChildrenNodeIds(id) {
    return Object.keys(state.nodes).filter(nodeId => state.nodes[nodeId].parent == id);
  }

  do {
    nodeIds.push(nodeId);
    childrenNodeIds = getChildrenNodeIds(nodeId);
    if (childrenNodeIds.length > 1) {
      choiceNodes.push(nodeId);
    }
  } while (childrenNodeIds.length && (nodeId = childrenNodeIds[0]));
  
  return (
    <section>
      { nodeIds.map((id) => {
        const hasAdjacentChoices = choiceNodes.indexOf(state.nodes[id].parent) !== -1;
        return <Node key={id} id={id} hasAdjacentChoices={hasAdjacentChoices}/>
      }) }
      <style jsx>{`
        section {
          flex: 1 75%;
        }
      `}</style>
    </section>
  );
}
