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
    return Object.keys(state.nodes).filter(nodeId => {
      const parent = state.nodes[nodeId].parent;
      return typeof parent === 'object' ? parent.indexOf(id) !== -1 : parent == id;
    });
  }

  if (nodeId) {
    do {
      nodeIds.push(nodeId);
      childrenNodeIds = getChildrenNodeIds(nodeId);
      if (childrenNodeIds.length > 1) {
        choiceNodes.push(nodeId);
      }
    } while (childrenNodeIds.length && (nodeId = state.selectedChoices[nodeId] || childrenNodeIds[0]));
  }
  
  return (
    <section>
      { nodeIds.length > 0 && nodeIds.map((id) => {
        const parentId = state.nodes[id].parent;
        let siblings = [];
        if (choiceNodes.indexOf(parentId) !== -1) {
          siblings = getChildrenNodeIds(parentId);
        }
        return <Node key={id} id={id} siblings={siblings}/>
      }) }
      <style jsx>{`
        section {
          flex: 1 75%;
          padding-left: 3em;
          max-width: 42em;
        }
      `}</style>
    </section>
  );
}
