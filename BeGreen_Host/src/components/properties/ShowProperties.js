import React, { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import './ShowProperties.css'
import './scrollbar.css';
import { editProperty, fetchDeleteProperties, fetchProperties } from './FetchProperties';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBFile,
    MDBTextArea,
    MDBCard,
    MDBCardBody,
    MDBModal,
} from 'mdb-react-ui-kit';
import Modal from 'react-bootstrap/Modal';

const ShowProperties = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [data, setData] = useState([]);  // State za čuvanje podataka 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const showData = await fetchProperties();// Pozivanje funkcije i čekanje na rezultat
                setData(showData); // Postavljanje podataka u state 
            } catch (error) {
                console.log(error);
            }
        };
        fetchData(); // Pozivanje funkcije prilikom montiranja komponente 
    }, []);

    //za delete
    const handleDelete = async (propertyId) => {

        const prom = propertyId;
        localStorage.setItem("promid", prom);
        handleShow();
    }
    const handleDeleteID = async () => {
        const id = localStorage.getItem("promid");
        // console.log("OVO JE ID PROPERTIJA: " + id);
        await fetchDeleteProperties(id);
        handleClose();
    }

    //za edit 
    const [showEdit, setShowEdit] = useState(false);

    const handleCloseEdit = () => {
        setShowEdit(false);
    };
    const handleShowEdit = () => {
        setShowEdit(true);
    };
    const handleEdit = async (PropertyId) => {
        const idProperty = PropertyId;
        localStorage.setItem("PropertyId", idProperty);
        handleShowEdit();
    };
    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
          handleCloseEdit();
        }//U slucaju da se klikne van modala
    };

    const handleSubmitEdit = async (event) => {
        const idproperty = parseInt(localStorage.getItem("PropertyId"));

        event.preventDefault();
        var formData = new FormData();

        formData.append('Naziv', event.target.Naziv.value);
        formData.append('Grad', event.target.Grad.value);
        formData.append('Adresa', event.target.Adresa.value);
        formData.append('BrojSoba', parseInt(event.target.BrojSoba.value));
        formData.append('CenaPoNocenju', parseInt(event.target.CenaPoNocenju.value));
        formData.append('Opis', event.target.Opis.value);

        const files = event.target.Slika.files;
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        await editProperty(idproperty, formData);
        handleCloseEdit();
    }
    return (
        <>
            <div className='showPropertiesCardsContainer'>
                {data.map((value) => {
                    return (

                        <Card className='cards' style={{ width: '25rem' }} key={value.id} >
                            <Carousel>
                                {value.slika.map((sl, slikaIndex) => (
                                    <Carousel.Item className='home-picture' key={slikaIndex}>
                                        <img
                                            className="d-block w-100"
                                            src={sl}
                                            alt={`Slide ${slikaIndex}`} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <Card.Body>
                                <MDBRow className='mbd-row'>
                                    <MDBCol className='mdbColInfoName'>
                                        <Card.Title>{value.naziv}</Card.Title>
                                    </MDBCol>
                                    <MDBCol className='mdbColInfo'>
                                        <Card.Text>Near: {value.grad}</Card.Text>
                                    </MDBCol>
                                    <MDBCol className='mdbColInfo'>
                                        <Card.Text> {value.cena} RSD</Card.Text>
                                    </MDBCol>
                                    <MDBCol className='mdbColInfo'>
                                     <Card.Text>Number of likes: {value.brojSvidjanja}</Card.Text>
                                     </MDBCol>
                                    

                                </MDBRow>

                                <MDBRow>

                                    <MDBTextArea
                                        labelClass='text-white'
                                        className={'searchDescription scrollbar scrollbar-primary'}
                                        value={value.opis}
                                        name='Opis'
                                        id='Opis'
                                        size="lg"
                                        rows={3}
                                    />

                                </MDBRow>

                                <div className='properties-button-div'>
                                    {/*-----------------------------------------------Edit-----------------------------------------------*/}

                                    <Button variant='success' className='btn' onClick={() => handleEdit(value.id)}>Edit</Button>

                                    <MDBModal show={showEdit} onHide={handleCloseEdit} className='editModal' onClick={handleOutsideClick}>
                                        <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '580px', borderColor: "#31b675" }}>
                                            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto ' >
                                                <h2 className="fw-bold mb-2 text-uppercase" >Edit property</h2>
                                                <form action='formPropertyData' onSubmit={handleSubmitEdit}>

                                                    <label>Property name</label>
                                                    <MDBInput placeholder="Property name" labelClass='text-white' name='Naziv' id='Naziv' size="lg" />

                                                    <label>Near City</label>
                                                    <MDBInput placeholder="Near City" labelClass='text-white' name='Grad' id='Grad' size="lg" />

                                                    <label>Address</label>
                                                    <MDBInput placeholder="Adress" labelClass='text-white' name='Adresa' id='Adresa' size="lg" />

                                                    <label>Rooms</label>
                                                    <MDBInput type='number' min='0' placeholder="Number of rooms" labelClass='text-white' name='BrojSoba' id='BrojSoba' size="lg" />

                                                    <label>Price</label>
                                                    <MDBInput type='number' className='price' name='CenaPoNocenju' id='CenaPoNocenju' placeholder='RSD' min='0' size="lg" />

                                                    <label>Choose file</label>
                                                    <MDBFile type="file" id='customFile' name="Slika" multiple size="lg" />

                                                    <label>Description</label>
                                                    <MDBTextArea labelClass='text-white' name='Opis' id='Opis' size="lg" rows={4} />

                                                    <MDBRow className='property-Btns'>
                                                        <MDBCol className='mdbCol-Btns'>
                                                            <Button className='mb-4 w-100 btn' variant="success" size='lg' type='submit' onClick={handleCloseEdit}>
                                                                Save
                                                            </Button>
                                                        </MDBCol>

                                                        <MDBCol className='mdbCol-Btns'>
                                                            <Button className='mb-4 w-100 btn' size='lg' variant='secondary' onClick={handleCloseEdit}>
                                                                Close
                                                            </Button>
                                                        </MDBCol>
                                                    </MDBRow>

                                                </form>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBModal>


                                    {/*-----------------------------------------------Edit-----------------------------------------------*/}


                                    



                                    {/*-----------------------------------------------Delete-------------------------------------------- */}

                                    <Button variant="danger" className='btn delete-btn' onClick={() => handleDelete(value.id)}>
                                        Delete
                                    </Button>

                                    <Modal show={show} onHide={handleClose} className='deleteModal'>
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
                                    {/*-----------------------------------------------Delete-----------------------------------------------*/}
                                </div>
                            </Card.Body>
                        </Card>
                    )
                })}



            </div>
        </>
    )
}

export default ShowProperties
