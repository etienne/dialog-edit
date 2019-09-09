import Node from './Node';

export default function Dialog({ nodes }) {
  const nodeIds = Object.keys(nodes);

  return (
    <section>
      { nodeIds.map(id => <Node key={id} id={id} />) }
      <style jsx>{`
        section {
          flex: 1 75%;
        }
      `}</style>
    </section>
  );
}
