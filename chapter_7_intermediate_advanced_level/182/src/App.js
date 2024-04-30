import {useRef, useState} from 'react';
import {Container} from 'react-bootstrap';
import './App.css';
import {CSSTransition} from 'react-transition-group';

const Modal = (props) => {

  const duration = 300;


  const nodeRef = useRef(null);
  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={props.showModal}
      timeout={duration}
      onEnter={() => props.setShowTrigger(false)}
      onExited={() => props.setShowTrigger(true)}
      classNames={'modal'}
      unmountOnExit
    >
      <div ref={nodeRef} className="modal mt-5 d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Typical modal window</h5>
              <button onClick={() => props.onClose(false)} type="button" className="btn-close"
                      aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Modal body content</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => props.onClose(false)} type="button" className="btn btn-secondary">Close</button>
              <button onClick={() => props.onClose(false)} type="button" className="btn btn-primary">Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showTrigger, setShowTrigger] = useState(true);

  return (
    <Container>
      <Modal showModal={showModal} onClose={setShowModal} setShowTrigger={setShowTrigger}/>
      {showTrigger && <button
        type="button"
        className="btn btn-warning mt-5"

        onClick={() => setShowModal(true)}>Open Modal
      </button>}
    </Container>
  );
}

export default App;