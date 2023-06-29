import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import "./Control.css"
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { fetchDeleteOwner, editOwner } from './FetchController';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCard,
    MDBCardBody,
    MDBModal,
} from 'mdb-react-ui-kit';


const ControlOwner = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //za delete
    const handleDelete = async (ownerId) => {

        const prom = ownerId;
        localStorage.setItem("promid", prom);
        handleShow();
    }
    const handleDeleteID = async () => {
        const id = localStorage.getItem("promid");
        console.log("OVO JE ID Vlasnika: " + id);
        await fetchDeleteOwner(id);
        handleClose();
    }


    const [users, setUsers] = useState([])


    useEffect(() => {
        fetch("http://localhost:5163/Vlasnik/VratiSveVlasnike")
            .then(response => response.json())
            .then(json => setUsers(json))

    }, [])

    //za edit 
    const [showEdit, setShowEdit] = useState(false);

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);
    const handleEdit = async (ownerid) => {

        const idowner = ownerid;
        localStorage.setItem("OwnerId", idowner);
        handleShowEdit();
    }

    const handleSubmitEdit = async (event) => {
        const owneridd = parseInt(localStorage.getItem("OwnerId"));

        event.preventDefault();
        var formData = new FormData();

        formData.append('Ime', event.target.Ime.value);
        formData.append('Prezime', event.target.Prezime.value);
        formData.append('KorisnickoIme', event.target.KorisnickoIme.value);
        formData.append('Email', event.target.Email.value);
        formData.append('Lozinka', event.target.Lozinka.value);
        formData.append('BrojTelefona', event.target.BrojTelefona.value);

        await editOwner(owneridd, formData);
        handleCloseEdit();
    }

    return (
        <>
            <div className="divTable">
                <Table responsive striped bordered hover variant="dark" className="userTable" >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th colSpan={3}></th>
                        </tr>
                    </thead>
                    {users.map((user, index) => (
                        <tbody key={user.id}>
                            <tr>
                                <td >{index}</td>
                                <td >{user.ime}</td>
                                <td >{user.prezime}</td>
                                <td >{user.korisnickoIme}</td>
                                <td >{user.email}</td>
                                <td  >{user.brojTelefona}</td>
                                <td ><Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button></td>


                                <Modal show={show} onHide={handleClose} className='deleteOwnerModal'>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Warning</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Are you sure?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="danger" onClick={() => handleDeleteID()}>
                                            Yes
                                        </Button>

                                        <Button variant="secondary" onClick={handleClose}>
                                            No
                                        </Button>

                                    </Modal.Footer>
                                </Modal>

                                {/* ====================================================================================Edit================================================================================================ */}

                                <td ><Button size="sm" variant="warning" onClick={() => handleEdit(user.id)} >Edit</Button></td>

                                <MDBModal show={showEdit} onHide={handleCloseEdit} className='modal'>
                                    <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '580px', borderColor: "#31b675" }}>
                                        <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto ' >
                                            <h2 className="fw-bold mb-2 text-uppercase" >Edit owner</h2>
                                            <form action='formPropertyData' onSubmit={handleSubmitEdit}>


                                                <label>First Name</label>
                                                <MDBInput placeholder='First Name' labelClass='text-white' name='Ime' id='Ime' size="lg" />

                                                <label>Last Name</label>
                                                <MDBInput placeholder='Last Name' labelClass='text-white' name='Prezime' id='Prezime' size="lg" />

                                                <label>Username</label>
                                                <MDBInput placeholder='Username' labelClass='text-white' name='KorisnickoIme' id='KorisnickoIme' size="lg" />

                                                <label>Email</label>
                                                <MDBInput placeholder='Email' labelClass='text-white' name='Email' id='Email' size="lg" />

                                                <label>Password</label>
                                                <MDBInput placeholder='New password' labelClass='text-white' name='Lozinka' id='Lozinka' size="lg" />

                                                <label>Phone number</label>
                                                <MDBInput placeholder='Phone number' labelClass='text-white' name='BrojTelefona' id='BrojTelefona' size="lg" />

                                                <MDBRow className='property-Btns'>
                                                    <MDBCol className='mdbCol-Btns'>
                                                        <Button className='mb-4 w-100 sign-in-btn' variant="success" size='lg' type='submit' onClick={handleCloseEdit}>
                                                            Save
                                                        </Button>
                                                    </MDBCol>

                                                    <MDBCol className='mdbCol-Btns'>
                                                        <Button className='mb-4 w-100 sign-in-btn' size='lg' variant='secondary' onClick={handleCloseEdit}>
                                                            Close
                                                        </Button>
                                                    </MDBCol>
                                                </MDBRow>

                                            </form>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBModal>
                            </tr>
                        </tbody>
                    ))}

                </Table>
            </div>


        </>
    )
}

export default ControlOwner;