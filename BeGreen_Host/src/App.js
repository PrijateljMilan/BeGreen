import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './components/home/Home';
import NavbarBG from "./components/navbar/Navbar";
import SignIn from "./components/sign-in/SignIn";
import Register from "./components/register/Register";

import Search from "./components/search/Search";
import Reservations from "./components/reservations/Reservations";
import Properties from "./components/properties/Properties";
import ControlOwner from "./components/admin-control/ControlOwner";
import ControlUser from "./components/admin-control/ControlUser";
import Footer from "./components/home/Footer";
import Info from "./components/owner-info/Info";
function App() {
  let appLoginType = localStorage.getItem('userType');

  return (
    <Router>
      <NavbarBG />
      <Routes>
        <Route path='/' exact Component={Home}></Route>

        {(appLoginType !== 'owner' && appLoginType !== 'user' && appLoginType !== 'admin') &&
          <Route path='/sign-in' exact Component={SignIn}></Route>
        }

        {(appLoginType !== 'owner' && appLoginType !== 'user' && appLoginType !== 'admin') &&
          <Route path='/register' exact Component={Register}></Route>
        }

     

        <Route path='/search' exact Component={Search}></Route>

        {appLoginType === 'user' &&
          <Route path='/reservations' exact Component={Reservations}></Route>
        }

        {appLoginType === 'owner' &&
          <Route path='/properties' exact Component={Properties}></Route>
        }

        {appLoginType === 'owner' &&
          <Route path='/info' exact Component={Info}></Route>
        }

        {(appLoginType === 'admin') &&
          <Route path='/controlUser' exact Component={ControlUser}></Route>
        }

        {(appLoginType === 'admin') &&
          <Route path='/controlOwner' exact Component={ControlOwner}></Route>
        }

      </Routes>
      {/* <Cards/> */}
      {(appLoginType !== 'admin') &&
        <Footer />
      }
    </Router>
  );
}

export default App;
