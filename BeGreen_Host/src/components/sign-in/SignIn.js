import React from 'react';
import "./SignIn.css"
import { Button } from 'react-bootstrap';
import { useNavigate, } from 'react-router-dom';
import { useState } from 'react';
import jwt_decode from 'jwt-decode';

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import Toast from 'react-bootstrap/Toast';

function SignIn() {

  const [KorisnickoIme, setUsername] = useState('')
  const [Lozinka, setPassword] = useState('')


  const [vreme, setVreme] = useState("");
  const [textAlert, setAlert] = useState("");

  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/`;
    navigate(path);
  }

  // Pozivanje API-ja za prijavljivanje korisnika
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5163/api/Auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          KorisnickoIme,
          Lozinka
        })
      });

      if (!response.ok) {
        setShowA(true);
        let trenutnoVreme = new Date().toLocaleTimeString().split(':');
        setVreme(trenutnoVreme[0] + ":" + trenutnoVreme[1] + ":" + trenutnoVreme[2]);
        setAlert("Username or password is incorrect");
      }
      setShowA(false);
      var loginType = 'guest';
      localStorage.setItem('userType', loginType);

      console.log('Postavljen guest u loginType' + loginType);

      const data = await response.json();
      let tokenKey = "token";
      if (data.hasOwnProperty("tokenV")) {
        tokenKey = "tokenV";
        console.log('login potvrda za owner');
        loginType = 'owner'
        localStorage.setItem('userType', loginType);
        console.log('u localStorage guest postaje owner');

      }
      else if (data.hasOwnProperty("token")) {
        console.log('login potvrda za user');
        loginType = 'user';
        localStorage.setItem('userType', loginType);
        console.log('u localStorage guest postaje user')
      }
      else if (data.hasOwnProperty("tokenA")) {
        tokenKey = "tokenA";
        console.log('login potvrda za Admina');
        loginType = 'admin';
        localStorage.setItem('userType', loginType);
        console.log('u localStorage guest postaje admin')
      }
      console.log("Token:", data[tokenKey]);
      localStorage.setItem('authToken', data[tokenKey]);
      const decodedToken = JSON.stringify(jwt_decode(data[tokenKey]));

      console.log("Dekodirani token:", decodedToken);

      //Funkcija za pribavljanje username:
      const res = await fetch("http://localhost:5163/api/Auth/Preuzmi", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${data[tokenKey]}`
        }
      });
      const jsonData = await res.json();


      localStorage.setItem('userName', jsonData);
      //console.log("Ovo mi je potrebno:::" + jsonData);


      routeChange();
      window.location.reload(true);
    } catch (error) {
      setShowA(true);
      let trenutnoVreme = new Date().toLocaleTimeString().split(':');
      setVreme(trenutnoVreme[0] + ":" + trenutnoVreme[1] + ":" + trenutnoVreme[2]);
      setAlert("Username or password is incorrect");
    }
  }


  return (
    <MDBContainer fluid className='search-form'>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">Please enter your login and password!</p>

              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Username' id='username' type='username' size="lg" name="username" value={KorisnickoIme} onChange={e => setUsername(e.target.value)} />
              <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='password' type='password' size="lg" name="password" value={Lozinka} onChange={e => setPassword(e.target.value)} />

              <Button className='mb-4 w-100 sign-in-btn' variant="success" size='lg' onClick={handleLogin}>
                Sign In
              </Button>


              <div>
                <p className="mb-0">Don't have an account? <a href="/register" className="text-white-50 fw-bold">Register</a></p>

              </div>
            </MDBCardBody>
          </MDBCard>

        </MDBCol>
     
        
      </MDBRow>
      <div className='toast-div-sign-in'>
          <Toast show={showA} onClose={toggleShowA}>
            <Toast.Header>
              <img src="images/logo.png" className="rounded me-2 search-toast" alt="" />
              <strong className="me-auto">BeGreen</strong>
              <small>{vreme}</small>
            </Toast.Header>
            <Toast.Body>{textAlert}</Toast.Body>
          </Toast>
        </div>
      

    </MDBContainer>
  );

}

export default SignIn;