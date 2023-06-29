
//==========================================GET================================================================
export const fetchTowns = async () => {
  try {
    const response = await fetch(`http://localhost:5163/Smestaj/PreuzmiGradove`);

    const data = await response.json();
    const showData = data.map(smestaj => {
      return {
        grad: smestaj.grad,
      };
    });
    return showData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//==========================================post============================================
var userType = localStorage.getItem('userType');
export const fetchReserve = async (propertyId, checkIn, checkOut) => {
  console.log(propertyId);
  console.log(checkIn);
  console.log(checkOut);

  try {
    const data = {
      DatumDolaska: checkIn,
      DatumOdlaska: checkOut

    };
    const userName = localStorage.getItem('userName');
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5163/Rezervacija/DodajRezervaciju/${propertyId}/${userName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok && userType === 'user') {

      return "Booked successfully";

    }
    else if (userType != 'user') {
      return "The accommodation can only be reserved by a user, if you do not have an account please register"
    }
    else {
      return "The accommodation is already booked for the given date";
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchLike = async (propertyId) => {
  console.log(propertyId);


  try {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5163/Smestaj/Lajkuj/${propertyId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {

      console.log("Liked successfully");

    }

  } catch (error) {
    console.log(error);
    throw error;
  }
};