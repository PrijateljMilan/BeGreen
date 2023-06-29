
//==========================================GET================================================================
export const fetchProperties = async () => {
    try {
      const userName = localStorage.getItem('userName');
      const authToken = localStorage.getItem('authToken');
      console.log(authToken);
      const response = await fetch(`http://localhost:5163/Smestaj/PreuzmiSmestaj/${userName}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      const data = await response.json();
      const showData =  data.map((smestaj, index) => {
        const slike =  smestaj.slike.map((slika) => `http://localhost:5163/Smestaj/PreuzmiSliku/${slika.id}`);
        return {
          id: smestaj.id,
          slika: slike,
          naziv: smestaj.naziv,
          grad: smestaj.grad,
          cena: smestaj.cenaPoNocenju,
          opis: smestaj.opis,
          brojSvidjanja: smestaj.brojSvidjanja
        };
      });
      
      return showData;
     

    } catch (error) {
      console.log(error);
      throw error;
    }
  };
//=============================================DELETE===================================================
  export const fetchDeleteProperties = async (propertyId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5163/Smestaj/ObrisiSmestaj/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      if (response.ok) {
        console.log("Smestaj je uspesno izbrisan.");
        fetchProperties();
        window.location.reload(true);
      } else {
        console.log("Doslo je do greske prilikom brisanja smestaja.");
      }
  
  
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  //=========================================EDIT=========================================================
  export const editProperty = async (propertyId, updatedData) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5163/Smestaj/IzmeniSmestaj/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: updatedData
      });
      const data = await response.json();
     console.log(data.naziv);
      fetchProperties();
       window.location.reload(true);
    
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  