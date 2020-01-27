import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import Modal from './Modal';

const { publicRuntimeConfig } = getConfig();

export default function VersionsModal({ dismissAction, submitAction }) {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState();

  useEffect(() => {
    if (process.browser) {
      fetch(publicRuntimeConfig.serverEndpoint + '/versions').then(res => res.json()).then(json => {
        setVersions(json.reverse());
      });
    }
  }, []);

  const selectVersion = version => setSelectedVersion(version);
  const handleVersionClick = (changeEvent) => {
    setSelectedVersion(changeEvent.target.value);
  };
  const saveValidation = () => {
    return !!selectedVersion;
  };
  const handleRevert = () => {
    if (process.browser) {
      fetch(publicRuntimeConfig.serverEndpoint + '/versions/' + selectedVersion).then(res => res.json()).then(json => {
        submitAction(json);
      });
    }
  };

  return (
    <Modal dismissAction={dismissAction} submitAction={handleRevert} saveLabel="Revert" saveValidation={saveValidation}>
      <h2>Version history</h2>
      <ul>
        <li className="head">
          <div className="radio"></div>
          <div className="date">Date</div>
          <div className="size">Size</div>
        </li>
        { versions.map(version => {
          const date = new Date(parseInt(version.date) * 1000).toLocaleString('en-CA');
          const isSelected = version.id === selectedVersion;

          return <li key={version.id} className={isSelected && 'selected'} onClick={() => selectVersion(version.id)}>
            <div className="radio">
              <input type="radio" value={version.id} checked={isSelected} onChange={handleVersionClick} />
            </div>
            <div className="date">{date}</div>
            <div className="size">{version.size}</div>
          </li>
        }) }
      </ul>
      <style jsx>{`
        ul {
          padding: 0;
        }

        li {
          list-style: none;
          display: flex;
          border-radius: 5px;
          padding: 0.3em 0.6em;
          cursor: pointer;
        }

        li:hover {
          background-color: #eee;
        }

        li.head {
          font-weight: bold;
          cursor: auto;
        }

        li.head:hover {
          background-color: transparent;
        }

        li.selected {
          background-color: #eee;
        }

        div.radio {
          flex: 0 0 10%;
        }

        div.date {
          flex: 0 0 75%;
        }

        div.size {
          flex: 0 0 15%;
          text-align: right;
          color: #ccc;
        }
      `}</style>
    </Modal>
  );  
}
