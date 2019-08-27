import Dialog from '../components/Dialog';

export default () => {
  return (
    <div>
      <Dialog/>
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

