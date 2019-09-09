export default function IconButton({ icon, alt, action }) {
  return (
    <button onClick={action}>
      <img src={`/static/${icon}.svg`} alt={alt} />
      <style jsx>{`
        button {
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: white;
          padding: 0;
          margin-right: 0.6em;
          cursor: pointer;
        }

        button:hover {
          background-color: #eee;
        }

        button img {
          display: block;
        }
      `}</style>
    </button>
  )
}
