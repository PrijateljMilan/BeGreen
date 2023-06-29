export const fetchDeleteReservation = async (reservationId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5163/Rezervacija/ObrisiRezervaciju/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      if (response.ok) {
        console.log("Rezervacija je uspesno izbrisana.");
       
        window.location.reload(true);
      } else {
        console.log("Doslo je do greske prilikom brisanja rezervacije.");
      }
  
  
    } catch (error) {
      console.log(error);
      throw error;
    }
  };