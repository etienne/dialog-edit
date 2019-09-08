import Node from './Node';

export default function Dialog({ nodes, addNode }) {
  const nodeIds = Object.keys(nodes);

  return (
    <>
      { nodeIds.map(id => <Node key={id} id={id} addNode={addNode} />) }
    </>
  );
}
