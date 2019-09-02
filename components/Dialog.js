import Node from './Node';

export default function Dialog({ nodes, addNode }) {
  return (
    <>
      { nodes.map(node => <Node key={node.id} id={node.id} addNode={addNode} />) }
    </>
  );
}
