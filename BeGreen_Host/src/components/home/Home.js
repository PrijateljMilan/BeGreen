import React, { useState } from 'react'
import './Home.css'
import Carousel from 'react-bootstrap/Carousel';
import Cards from "./Cards";

const Home = () => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <>
            {/*-------------------------------------------------------------------Slider*/}
            <Carousel activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item className='home-picture'>
                    <img
                        className="d-block w-100"
                        src="/images/home/slider-1.jpg"
                        alt="First slide" />
                    <Carousel.Caption className='homeCaptions'>
                        <h1>Spend Your Holidays With Us</h1>
                        <p>We offer the most affortable and comfortable services</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item className='home-picture'>
                    <img
                        className="d-block w-100 "
                        src="/images/home/slider-2.jpg"
                        alt="Second slide" />

                    <Carousel.Caption className='homeCaptions'>
                        <h1>Discover Your Perfect Getaway</h1>
                        <p>We're committed to providing exceptional customer service every step of the way </p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item className='home-picture'>
                    <img
                        className="d-block w-100"
                        src="/images/home/slider-5.jpg"
                        alt="Third slide" />

                    <Carousel.Caption className='homeCaptions'>
                        <h1>Start Planning Your Next Adventure Today!</h1>
                        <p>Make informed decisions with confidence</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            {/*-------------------------------------------------------------------Slider*/}
            <Cards/>
        </>

    );


}

export default Home;
