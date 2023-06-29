import React, { useState } from 'react';
import "./Properties.css"
import { Button } from 'react-bootstrap';
import ShowProperties from './ShowProperties';

import {
    MDBTextArea,
    MDBModal,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBFile,
} from 'mdb-react-ui-kit';

export function addprop() { return (<ShowProperties />) }

export default function AddProperties() {



    const [basicModal, setBasicModal] = useState(false);

    const toggleShow = () => { setBasicModal(!basicModal); }

    const authToken = localStorage.getItem('authToken');
    let name2 = localStorage.getItem('userName');

    const handleSubmit = async (event) => {
        console.log(name2);
        event.preventDefault();
        var formData = new FormData();

        formData.append('Naziv', event.target.Naziv.value);
        formData.append('Grad', event.target.Grad.value);
        formData.append('Adresa', event.target.Adresa.value);
        formData.append('BrojSoba', event.target.BrojSoba.value);
        formData.append('CenaPoNocenju', event.target.CenaPoNocenju.value);
        formData.append('Opis', event.target.Opis.value);

        const files = event.target.Slika.files;
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('username', name2);
        const response = await fetch('http://localhost:5163/Smestaj/Create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (response.ok) {
            console.log('Vikendica uspešno dodata!');
            window.location.reload(true);
        } else {
            console.error("Greska");
        }
    }

    return (
        <>

            <div>
                <div className='addPropertyBtn'>
                    <Button className='addProperties' onClick={toggleShow}>Add new property</Button>
                </div>
                <div className='showPropertiesCardsContainer'>
                    {addprop()}
                </div>
            </div>

            <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1' className='addModal'>
                <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '580px', borderColor: "#31b675" }}>
                    <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto ' >
                        <h2 className="fw-bold mb-2 text-uppercase" >Add new property</h2>
                        <form action='formPropertyData' onSubmit={handleSubmit}>

                            <label>Propery name</label>
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
                                    <Button className='mb-4 w-100 sign-in-btn' variant="success" size='lg' type='submit' onClick={toggleShow}>
                                        Save
                                    </Button>
                                </MDBCol>

                                <MDBCol className='mdbCol-Btns'>
                                    <Button className='mb-4 w-100 sign-in-btn' size='lg' variant='secondary' onClick={toggleShow}>
                                        Close
                                    </Button>
                                </MDBCol>
                            </MDBRow>

                        </form>
                    </MDBCardBody>
                </MDBCard>
            </MDBModal >
        </>
    )
}