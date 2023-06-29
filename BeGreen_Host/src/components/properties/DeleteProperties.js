import React, { useState } from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';

export default function DeleteProperties() {
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => setBasicModal(!basicModal);

  return (
    <>
      <Button variant='danger' onClick={toggleShow}>Delete</Button>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle className='modal-title'>Warning!</MDBModalTitle>
              <Button className='btn-close' variant='secondary' onClick={toggleShow}></Button>
            </MDBModalHeader>
            <MDBModalBody className='modal-body'>Are you sure?</MDBModalBody>

            <MDBModalFooter>
              <Button variant='secondary' onClick={toggleShow}>
                Close
              </Button>
              <Button variant='danger'>Delete</Button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
