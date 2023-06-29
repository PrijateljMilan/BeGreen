import React from 'react'
import "./Register.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox
} from 'mdb-react-ui-kit';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


const Register = () => {

    const [Ime, setName] = useState('');
    const [ImeValid, setNameValid] = useState(true);
    const [Prezime, setLastname] = useState('');
    const [PrezimeValid, setLastnameValid] = useState(true);
    const [KorisnickoIme, setUsername] = useState('');
    const [KorisnickoImeValid, setUsernameValid] = useState(true);
    const [Email, setEmail] = useState('');
    const [EmailValid, setEmailValid] = useState(true);
    const [Lozinka, setPassword] = useState('');
    const [LozinkaValid, setPasswordValid] = useState(true);
    const [PotvrdaLozinke, setPasswordCheck] = useState('');
    const [PotvrdaLozinkeValid, setPasswordCheckValid] = useState(true);
    const [BrojTelefona, setPhoneNumber] = useState('');
    const [BrojTelefonaValid, setPhoneNumberValid] = useState(true);
    const [role, setUserType] = useState('');

    const validateName = () => {
        const nameRegex = /^[A-Z][a-z]*$/;
        const isValid = nameRegex.test(Ime);
        setNameValid(isValid);
    };

    const validateLastname = () => {
        const lastnameRegex = /^[A-Z][a-z]*$/;
        const isValid = lastnameRegex.test(Prezime);
        setLastnameValid(isValid);
    };

    const validateUsername = async () => {
        const res = await fetch(`http://localhost:5163/api/Auth/ProveriKorisnickoIme/${KorisnickoIme}`);

        if (res.ok) {
            const isValid = true;
            setUsernameValid(isValid);
        }
        else {
            const isValid = false;
            setUsernameValid(isValid);
        }
    }

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const isValid = emailRegex.test(Email);
        setEmailValid(isValid);
    };

    const validatePassword = () => {
        // Postavite svoje uslove za validaciju lozinke
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        const isValid = passwordRegex.test(Lozinka);
        setPasswordValid(isValid);
    };

    const validatePasswordCheck = () => {
        const isValid = PotvrdaLozinke === Lozinka;
        setPasswordCheckValid(isValid);
    };

    const validatePhoneNumber = () => {
        const phoneNumberRegex = /^06\d{6,9}$/;
        const isValid = phoneNumberRegex.test(BrojTelefona);
        setPhoneNumberValid(isValid);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
        setNameValid(true); // Resetovanje validacije prilikom promene vrednosti
    };

    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
        setLastnameValid(true); // Resetovanje validacije prilikom promene vrednosti
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setUsernameValid(true); // Resetovanje validacije prilikom promene vrednosti
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailValid(true); // Resetovanje validacije prilikom promene vrednosti
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordValid(true); // Resetovanje validacije prilikom promene vrednosti
    };

    const handlePasswordCheckChange = (event) => {
        setPasswordCheck(event.target.value);
        setPasswordCheckValid(true); // Resetovanje validacije prilikom promene vrednosti
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
        setPhoneNumberValid(true); // Resetovanje validacije prilikom promene vrednosti 
    };


    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/sign-in`;
        navigate(path);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            Ime,
            Prezime,
            KorisnickoIme,
            Email,
            Lozinka,
            PotvrdaLozinke,
            BrojTelefona,
            role
        };



        // Validacija imena:
        validateName();

        //  Validacija prezimena:
        validateLastname();

        // Validacija Korisnickog imena
        validateUsername();

        // Validacija Email:
        validateEmail();

        // Validacija Sifre:
        validatePassword();

        // Validacija SifreProvera:
        validatePasswordCheck();

        //  Validacija telefonskog broja:
        validatePhoneNumber();

        //Provera validnosti svih polja pre slanja podataka
        try {
            // if (ImeValid === true && PrezimeValid === true && LozinkaValid === true && PotvrdaLozinkeValid === true && BrojTelefonaValid === true && EmailValid === true && KorisnickoImeValid === true) {
            // Ostatak koda za slanje podataka na server 

            if (role === "Korisnik") {
                const response = await fetch("http://localhost:5163/api/Auth/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {

                    routeChange();
                }
                else {
                    const errorResponse = await response.text();
                    console.log("Greška prilikom registracije: " + errorResponse);
                }
            }
            else {
                const response = await fetch("http://localhost:5163/api/Auth/registerV", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    routeChange();
                }
                else {
                    const errorResponse = await response.text();
                    console.log("Greška prilikom registracije: " + errorResponse);
                }
            }



            // } else {
            //     // Obavestiti korisnika da postoje nevalidna polja 
            //     console.log("nesto ne valja");
            // }

        } catch (error) {
            console.error("Doslo je do greske " + error);
        }

    };



    return (
        <>
            <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image background-register' >
                <div className='mask gradient-custom-3'></div>
                <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
                    <MDBCardBody className='px-5'>
                        <h2 className="text-uppercase text-center mb-5">Create an account</h2>
                        <div className='register-inputs'>


                            {/* {!ImeValid && <div className='invalid-feedback'>Invalid name.</div>} */}
                            <OverlayTrigger
                                key='top1'
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top1`}>
                                        <strong>A first letter of a name must be upercase and not a number or a special character</strong>.
                                    </Tooltip>
                                }
                            >
                                <MDBInput wrapperClass='mb-4' label='Your Name' size='lg' id='name' type='text' name='name' value={Ime} onChange={handleNameChange} className={ImeValid ? '' : 'is-invalid'} />
                            </OverlayTrigger>




                            {/* {!PrezimeValid && <div className='invalid-feedback'>Invalid lastname.</div>} */}
                            <OverlayTrigger
                                key='top2'
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top2`}>
                                        <strong>A first letter of a lastname must be upercase and not a number or a special character</strong>.
                                    </Tooltip>
                                }
                            >
                                <MDBInput wrapperClass='mb-4' label='Your Last name' size='lg' id='lastname' type='text' name='lastname' value={Prezime} onChange={handleLastnameChange} className={PrezimeValid ? '' : 'is-invalid'} />
                            </OverlayTrigger>



                            <OverlayTrigger
                                key='top3'
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top3`}>
                                        <strong>Username must be unique</strong>.
                                    </Tooltip>
                                }
                            >
                                <MDBInput wrapperClass='mb-4' label='Your Username' size='lg' id='username' type='text' name='username' value={KorisnickoIme} onChange={handleUsernameChange} className={KorisnickoImeValid ? '' : 'is-invalid'} />
                            </OverlayTrigger>


                            {/* {!EmailValid && <div className='invalid-feedback'>Invalid email address.</div>} */}
                            <OverlayTrigger
                                key='top4'
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top4`}>
                                        <strong>Example: example@example.com</strong>.
                                    </Tooltip>
                                }
                            >
                                <MDBInput wrapperClass='mb-4' label='Your Email' size='lg' id='email' type='email' name='email' value={Email} onChange={handleEmailChange} className={EmailValid ? '' : 'is-invalid'} />
                            </OverlayTrigger>



                            {/* {!LozinkaValid && <div className='invalid-feedback'>Password must contain at least 6 characters, including uppercase and lowercase letters, and numbers.</div>} */}
                            <OverlayTrigger
                                key='top5'
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top5`}>
                                        <strong>Password must contain at least 6 characters, including uppercase and lowercase letters, and numbers</strong>.
                                    </Tooltip>
                                }
                            >
                                <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='password' type='password' name='password' value={Lozinka} onChange={handlePasswordChange} className={LozinkaValid ? '' : 'is-invalid'} />
                            </OverlayTrigger>


                            {/* {!PotvrdaLozinkeValid && <div className='invalid-feedback'>Passwords do not match.</div>} */}
                            <OverlayTrigger
                                key='top6'
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top6`}>
                                        <strong>Repeat exactly the same password</strong>.
                                    </Tooltip>
                                }
                            >
                                <MDBInput wrapperClass='mb-4' label='Repeat your password' size='lg' id='passwordCheck' type='password' name='passwordCheck' value={PotvrdaLozinke} onChange={handlePasswordCheckChange} className={PotvrdaLozinkeValid ? '' : 'is-invalid'} />
                            </OverlayTrigger>




                            {/* {!BrojTelefonaValid && <div className='invalid-feedback'>Invalid phone number.</div>} */}
                            <OverlayTrigger
                                key='top7'
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top7`}>
                                        <strong>Number must start with 06 and be at least 10 characters long</strong>.
                                    </Tooltip>
                                }
                            >
                                <MDBInput wrapperClass='mb-4' label='Phone number' size='lg' id='phoneNumber' type='phone' name='phoneNumber' value={BrojTelefona} onChange={handlePhoneNumberChange} className={BrojTelefonaValid ? '' : 'is-invalid'} />
                            </OverlayTrigger>


                        </div>
                        <div className='d-flex flex-row justify-content-center mb-4'>
                            <Form>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check checked={role === 'Korisnik'} name='radio' value='Korisnik' onChange={(e) => setUserType(e.target.value)}
                                            inline
                                            label="User"
                                            type={type}
                                            id={`inline-${type}-1`}
                                        />
                                        <Form.Check checked={role === 'Vlasnik'} name='radio' value='Vlasnik' onChange={(e) => setUserType(e.target.value)}
                                            inline
                                            label="Owner"
                                            type={type}
                                            id={`inline-${type}-2`}
                                        />
                                    </div>
                                ))}
                            </Form>
                        </div>

                        <Button className='mb-4 w-100 register-btn' variant="success" size='lg' type='submit' onClick={handleSubmit}>Register</Button>

                        <div className='sign-in-link'>
                            <p className="mb-0">Already have an account? <a href="/sign-in" className="text-white-50 fw-bold">Sign In</a></p>
                        </div>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </>
    )
}

export default Register
