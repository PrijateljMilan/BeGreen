import React, { useEffect, useState } from 'react';
import "./Search.css"
import "./scrollbar.css"
import { Button, ButtonGroup, Carousel, DropdownButton, Row } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBTextArea,
} from 'mdb-react-ui-kit';
import { fetchTowns } from './FetchSearch';
import { orderBy } from 'lodash';
import Toast from 'react-bootstrap/Toast';
import { fetchLike, fetchReserve } from './FetchSearch';
import Heart from 'react-heart';

function Search() {
    const [data, setData] = useState([]);
    const [vreme, setVreme] = useState("");
    const [textAlert, setAlert] = useState("");
    const [propertyId, setProperty] = useState("");
    const [checkIn, setDateIn] = useState("");
    const [checkOut, setDateOut] = useState("");

    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);

    const [activeHearts, setActiveHearts] = useState(() => {
        const savedHearts = localStorage.getItem('activeHearts');
        return savedHearts ? JSON.parse(savedHearts) : {};
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const showData = await fetchTowns();
                setData(showData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const [v, setValue] = useState('Destinations');
    const handleSelect = (e) => {
        console.log(e);
        setValue(e)
    }
    const [dataSmestaj, setDataSmestaj] = useState([]);

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const formData = new FormData();
            const checkInDate = new Date(event.target.datumOd.value).toISOString();
            const checkOutDate = new Date(event.target.datumDo.value).toISOString();
            setDateIn(checkInDate);
            setDateOut(checkOutDate);

            formData.append('Grad', v);
            formData.append('DatumOd', checkInDate);
            formData.append('DatumDo', checkOutDate);
            formData.append('BrojSoba', parseInt(event.target.brojSoba.value));

            const response = await fetch('http://localhost:5163/Smestaj/PretraziSmestaje', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                setShowA(false);
                const sortedData = orderBy(data, 'cenaPoNocenju', 'asc');
                const showData = sortedData.map((smestaj, index) => {
                    const slike = smestaj.slike.map((slika) => `http://localhost:5163/Smestaj/PreuzmiSliku/${slika.id}`);
                    return {
                        id: smestaj.id,
                        slika: slike,
                        naziv: smestaj.naziv,
                        grad: smestaj.grad,
                        cena: smestaj.cenaPoNocenju,
                        opis: smestaj.opis,
                        brojSvidjanja: smestaj.brojSvidjanja
                    };
                })
                setDataSmestaj(showData);
            } else {
                setShowA(true);
                let trenutnoVreme = new Date().toLocaleTimeString().split(':');
                setVreme(trenutnoVreme[0] + ":" + trenutnoVreme[1] + ":" + trenutnoVreme[2]);
                setAlert("There is no accommodation with those filters!");
            }
        } catch (error) {
            setShowA(true);
            let trenutnoVreme = new Date().toLocaleTimeString().split(':');
            setVreme(trenutnoVreme[0] + ":" + trenutnoVreme[1] + ":" + trenutnoVreme[2]);
            setAlert("All fields must be entered correctly!");
        }
    };

    const handleReserve = async (propertyId) => {
        const prom = (await fetchReserve(propertyId, checkIn, checkOut)).toString();
        setShowA(true);
        let trenutnoVreme = new Date().toLocaleTimeString().split(':');
        setVreme(trenutnoVreme[0] + ":" + trenutnoVreme[1] + ":" + trenutnoVreme[2]);
        setAlert(prom);
    }


    const handleLike = async (propertyId) => {
        const isLiked = localStorage.getItem('liked_' + propertyId);
        if (isLiked) {
            return; // Ako je već kliknuto, prekini izvršavanje
        }

        // Ako korisnik nije kliknuo na srce, nastavi s inkrementacijom
        const updatedHearts = { ...activeHearts };
        updatedHearts[propertyId] = updatedHearts[propertyId] + 1 || 1;
        setActiveHearts(updatedHearts);

        // Označi da je korisnik kliknuo na srce
        localStorage.setItem('liked_' + propertyId, true);

        localStorage.setItem('activeHearts', JSON.stringify(updatedHearts));
        await fetchLike(propertyId); // Promijenjeno ovdje
    };

    let contactType = localStorage.getItem('userType');

    return (
        <div className='search-div'>
            <div className='search-show'>
                <Row xs={1} md={3} className="d-flex justify-content-center g-4">
                    <div className='form-div'>
                        <MDBContainer className='search-form '>
                            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                                <MDBCol col='12'>
                                    <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                                        <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                                            <h2 className="fw-bold mb-2 text-uppercase">Search</h2>
                                            <form onSubmit={handleSubmit}>
                                                <DropdownButton
                                                    id='Grad'
                                                    name="Grad"
                                                    size="lg"
                                                    variant='light'
                                                    title={v}
                                                    onSelect={handleSelect}
                                                    value={v}
                                                >
                                                    {data.map((value, index) => (
                                                        <Dropdown.Item eventKey={value.grad} key={value.grad}>{value.grad}</Dropdown.Item>
                                                    ))}
                                                </DropdownButton>
                                                <MDBInput wrapperClass='mb-4 mx-1 w-100' labelClass='text-white' label='Check-in date' id='datumOd' name='datumOd' type='date' size="lg" />
                                                <MDBInput wrapperClass='mb-4 mx-1 w-100' labelClass='text-white' label='Check-out date' id='datumDo' name='datumDo' type='date' size="lg" />
                                                <MDBInput wrapperClass='mb-4 mx-1 w-100' labelClass='text-white' label='Number of rooms' id='brojSoba' name='brojSoba' type='number' min='1' size="lg" />
                                                <Button className='mb-4 mx-1 w-100 sign-in-btn' variant="success" size='lg' type="submit">
                                                    Search
                                                </Button>
                                            </form>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </div>
                    <div className='search-result'>
                        {dataSmestaj.map(s =>
                            <Card className='cards' style={{ width: '25rem', height: '30rem' }} key={s.id} >
                                <Carousel>
                                    {Array.isArray(s.slika) && s.slika.map((sl, slikaIndex) => (
                                        <Carousel.Item className='home-picture' key={slikaIndex}>
                                            <img
                                                className="d-block w-100"
                                                src={sl}
                                                alt={`Slide ${sl}`}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                                <Card.Body>
                                    <MDBRow>
                                        <MDBCol className='mdbColInfo'>
                                            <Card.Title className="Nazivdiv">{s.naziv}</Card.Title>
                                        </MDBCol>
                                        <MDBCol>
                                            {contactType === 'user' && (
                                                <div style={{ width: "2rem", float: 'right' }}>
                                                    <Heart
                                                        isActive={activeHearts[s.id]}
                                                        onClick={() => handleLike(s.id)}
                                                        style={{ fill: activeHearts[s.id] ? "red" : "white", stroke: activeHearts[s.id] ? "red" : "white" }}
                                                    />
                                                </div>
                                            )}
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className='mbd-row'>
                                        <MDBCol className='mdbColInfo mdbColInfoCena'>
                                            <Card.Text>{s.cena} RSD</Card.Text>
                                        </MDBCol>
                                        <MDBCol className='mdbColInfo'>
                                            <Card.Text>Near: {s.grad}</Card.Text>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow>
                                        <MDBTextArea
                                            className={'searchDescription scrollbar scrollbar-primary'}
                                            labelClass='text-white'
                                            value={s.opis}
                                            name='Opis'
                                            id='Opis'
                                            size="lg"
                                            rows={3}
                                        />
                                    </MDBRow>
                                    <MDBRow className='reservate'>
                                        <Button className='mb-4 mx-1 w-50 reservate-btn' onClick={() => handleReserve(s.id)} variant="success" size='lg' type="submit">
                                            Reserve
                                        </Button>
                                    </MDBRow>
                                </Card.Body>
                            </Card>
                        )}
                    </div>

                </Row>
            </div>
            <div className='toast-div-search'>
                <Toast show={showA} onClose={toggleShowA}>
                    <Toast.Header>
                        <img src="images/logo.png" className="rounded me-2 search-toast" alt="" />
                        <strong className="me-auto">BeGreen</strong>
                        <small>{vreme}</small>
                    </Toast.Header>
                    <Toast.Body>{textAlert}</Toast.Body>
                </Toast>
            </div>
        </div>


    );
}

export default Search;
