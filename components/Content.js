export default function Content({ children }) {
  return (
    <section>
      { children }
      <style jsx>{`
        section {
          padding-left: 3em;
          grid-area: content;
        }
      `}</style>
    </section>
  );
}
