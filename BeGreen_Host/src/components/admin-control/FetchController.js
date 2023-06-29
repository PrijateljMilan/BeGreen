export const fetchDeleteOwner = async (ownerId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5163/Vlasnik/IzbrisiVlasnika/${ownerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    if (response.ok) {
      console.log("Vlasnik je uspesno izbrisan.");
      // fetchProperties();
      window.location.reload(true);
    } else {
      console.log("Doslo je do greske prilikom brisanja Vlasnika.");
    }


  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchDeleteUser = async (userId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5163/Korisnik/IzbrisiKorisnika/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    if (response.ok) {
      console.log("Vlasnik je uspesno izbrisan.");
      // fetchProperties();
      window.location.reload(true);
    } else {
      console.log("Doslo je do greske prilikom brisanja Vlasnika.");
    }


  } catch (error) {
    console.log(error);
    throw error;
  }
};
//=========================================EDIT=========================================================
export const editUser = async (userId, updatedData) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5163/Korisnik/IzmeniKorisnika/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: updatedData
    });
    const data = await response.json();
    console.log(data.naziv);
    //fetchProperties();
    window.location.reload(true);

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const editOwner = async (ownerId, updatedData) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5163/Vlasnik/IzmeniVlasnika/${ownerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: updatedData
    });
    const data = await response.json();
    console.log(data.naziv);
    //fetchProperties();
    window.location.reload(true);

  } catch (error) {
    console.log(error);
    throw error;
  }
}
