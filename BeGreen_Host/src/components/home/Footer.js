import React from 'react'
import './Footer.css'


const Footer = () => {
    return (
        <section className='footer'>
            <div className='footer-up'>
                <div className='logo-div'>
                    <img src='images/logo.png' />
                </div>
                <div className='about-us-div'>
                    <h1>About Us</h1>
                    <p>At BeGreen Website, we believe in the transformative power of spending time in nature.
                        It offers rejuvenation, inspiration, and a profound connection to the world around us. 
                        We strive to facilitate those transformative experiences for you, creating lifelong memories and a deep appreciation for the wonders of our planet.</p>
                </div>
            </div>
            <div className='copyright-div'>
                <p>Copyright ©2023 All rights reserved </p>
            </div>
        </section>
    )
}
export default Footer
