import ReactDOM from 'react-dom';
import Button from './Button';

export default function Modal({ children, dismissAction, submitAction, saveLabel, saveValidation }) {
  const modalElement = document.getElementById('modal');
  const saveAction = () => {
    submitAction();
    dismissAction();
  }

  return ReactDOM.createPortal((
    <section>
      <div className="modal">
        <div className="content">
          {children}
        </div>
        <div className="actions">
          <Button title="Cancel" action={dismissAction}/>
          <Button title={saveLabel} type="primary" disabled={!saveValidation()} action={saveAction}/>
        </div>
      </div>
      <style jsx>{`
        section {
          background-color: rgba(220, 220, 220, 0.3);
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        div.modal {
          box-shadow: 0 10px 35px 0 rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.1  );
          border-radius: 5px;
          background-color: white;
          width: 440px;
          padding: 2em;
        }

        div.content {
          max-height: calc(90vh - 6em);
          overflow: auto;
        }
        
        div.actions {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          padding-top: 2em;
        }
      `}</style>
    </section>), modalElement
  );
}

Modal.defaultProps = {
  saveLabel: 'Save',
}
