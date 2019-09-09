import { useContext } from 'react';
import { Store } from '../state/store';
import Node from './Node';

export default function Dialog({ rootId }) {
  const { state } = useContext(Store);
  let node = rootId;
  const nodes = [];
  let childrenNodes;

  function getChildrenNodes(id) {
    console.log('getChildrenNodes ran with id = ', id, 'with result', Object.keys(state.nodes).filter(node => state.nodes[node].parent == id));
    return Object.keys(state.nodes).filter(node => state.nodes[node].parent == id);
  }

  do {
    nodes.push(node);
    childrenNodes = getChildrenNodes(node);
    if (childrenNodes.length > 1) {
      console.warn('More than one children for node ', node);
    }
  } while (childrenNodes.length && (node = childrenNodes[0]));

  return (
    <section>
      { nodes.map(id => <Node key={id} id={id} />) }
      <style jsx>{`
        section {
          flex: 1 75%;
        }
      `}</style>
    </section>
  );
}
