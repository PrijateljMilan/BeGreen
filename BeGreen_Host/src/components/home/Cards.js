import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import React, { useState, useEffect } from 'react';
import './Cards.css';
import { fetchHomeCards } from './FetchHomeCards';
import {
    MDBRow,
    MDBCol,
    MDBTextArea,
} from 'mdb-react-ui-kit';

function Cards() {

    const [data, setData] = useState([]);  // State za čuvanje podataka 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const showData = await fetchHomeCards();// Pozivanje funkcije i čekanje na rezultat
                setData(showData); // Postavljanje podataka u state
            } catch (error) {
                console.log(error);
            }
        };
        fetchData(); // Pozivanje funkcije prilikom montiranja komponente 
    }, []);

    return (
        <>

            <Carousel fade={true} controls={false} indicators={false}>
                <Carousel.Item>
                    <div className='cardText'><h3>Check out some of our popular places</h3></div>
                    {/* ------------------------------------------------------------------------Card 1 */}

                    <div className='cards-div'>
                        {data.map((value) => {
                            return(
                            <Card className='cards homeCards' style={{ width: '25rem' }} key={value.id} >
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
                                </Card.Body>
                            </Card>
                            )
                        })
                        }
                    </div>

                </Carousel.Item>
            </Carousel>


        </>

    );

}

export default Cards;