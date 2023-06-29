import "./Info.css"
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { fetchDeleteReservation } from "./FetchInfo";


const Info = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [rezervation, setReservation] = useState([])
    //za delete
    const handleDelete = async (index) => {

        const prom = index;
        localStorage.setItem("promid", prom);
        handleShow();
    }
    const handleDeleteID = async () => {
        const id = localStorage.getItem("promid");
        console.log("Ovo je id rezervacije: " + id);
        await fetchDeleteReservation(id);
        handleClose();
    }

    const userName = localStorage.getItem('userName');
    const authToken = localStorage.getItem('authToken');
    useEffect(() => {
        fetch(`http://localhost:5163/Rezervacija/VratiSveRezervacijeVlasniku/${userName}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                setReservation(data);
            })

    }, [])

    return (
        <div className="divTableUser">
            <Table responsive striped bordered hover variant="dark" className="userTable" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Property Name</th>
                        <th>Near City</th>
                        <th>Address</th>
                        <th>Price</th>
                        <th>Date from</th>
                        <th>Date to</th>
                        <th>User</th>
                        <th>Phone number</th>
                        <th>Number of likes</th>
                        <th colSpan={2}> </th>
                    </tr>
                </thead>

                {rezervation.map((r, index) => (
                    <tbody key={index}>
                        <tr>
                            <td >{index}</td>
                            <td >{r.naziv}</td>
                            <td >{r.grad}</td>
                            <td >{r.adresa}</td>
                            <td >{r.ukupnaCena}</td>
                            <td >{r.datumDolaska}</td>
                            <td >{r.datumOdlaska}</td>
                            <td >{r.korisnickoImeKorisnika}</td>
                            <td >{r.brojTelefonaKorisnika}</td>
                            <td >{r.brojSvidjanja}</td>



                            <td ><Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>Cancel</Button></td>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Warning</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Are you sure?</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={() => handleDeleteID()} >
                                        Yes
                                    </Button>

                                    <Button variant="secondary" onClick={handleClose}>
                                        No
                                    </Button>

                                </Modal.Footer>
                            </Modal>
                        </tr>

                    </tbody>
                ))}
            </Table>
        </div>

    )
}
export default Info
