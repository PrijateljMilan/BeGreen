import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
//import NavDropdown from 'react-bootstrap/NavDropdown';


function NavbarBG() {

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/`;
    navigate(path);
  }
  /*Putanja do home page*/


  /*hadnleLogOut poziva logout button sto pretvara posetilaca portala u guest, 
  vraca korisnika na pocetnoj strani i radi refresh */
  const hadnleLogOut = () => {
    localStorage.setItem('userType', 'guest');
    routeChange();
    window.location.reload(true);

  }

  //Ovde se cuva vrednost da li je vlasnik/korisnik
  let navLoginType = localStorage.getItem('userType');
  console.log('U navbar navlogin type = ' + navLoginType);

  //Ucitavamo username iz localStorage
  let userName = localStorage.getItem('userName');
  console.log('Korisnicko ime: ' + userName);

  return (
    <Navbar bg="dark" variant='dark' expand="lg" sticky="top">
      <Container className='navbar-container'>
        <Navbar.Brand className='beGreenLogo' href="/">Be Green</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="cintainer-fluid">

            <Nav.Item>
              <Nav.Link className='navbarLinks' href="/">Home</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link className='navbarLinks' href="/search">Search</Nav.Link>
            </Nav.Item>

          

            {(navLoginType === 'user') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks' href="/reservations">Reservations</Nav.Link>
              </Nav.Item>
            }

            {(navLoginType === 'owner') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks' href="/properties">Properties</Nav.Link>
              </Nav.Item>
            }

            {(navLoginType === 'owner') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks' href="/info">Info</Nav.Link>
              </Nav.Item>
            }

            {(navLoginType === 'admin') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks' href="/controlUser">Control user</Nav.Link>
              </Nav.Item>
            }

            {(navLoginType === 'admin') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks' href="/controlOwner">Control owner </Nav.Link>
              </Nav.Item>
            }


          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="cintainer-fluid">

            {(navLoginType !== 'owner' && navLoginType !== 'user' && navLoginType !== 'admin') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks' href="/sign-in">Sign In</Nav.Link>
              </Nav.Item>
            }

            {(navLoginType !== 'owner' && navLoginType !== 'user' && navLoginType !== 'admin') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks' href="/register">Register</Nav.Link>
              </Nav.Item>
            }

            {(navLoginType === 'owner' || navLoginType === 'user' || navLoginType === 'admin') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks' onClick={hadnleLogOut}>Logout</Nav.Link>
              </Nav.Item>
            }

            {(navLoginType === 'owner' || navLoginType === 'user' || navLoginType === 'admin') &&
              <Nav.Item>
                <Nav.Link className='navbarLinks'>{userName}</Nav.Link>
              </Nav.Item>
            }

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarBG;