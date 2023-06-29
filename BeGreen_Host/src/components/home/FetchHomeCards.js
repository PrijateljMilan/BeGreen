export const fetchHomeCards = async () => {
    try {
      const response = await fetch(`http://localhost:5163/Smestaj/PreuzmiTopSmestaje`);
      const data = await response.json();
      const showData =  data.map((smestaj, index) => {
        const slike =  smestaj.slike.map((slika) => `http://localhost:5163/Smestaj/PreuzmiSliku/${slika.id}`);
        return {
          id: smestaj.id,
          slika: slike,
          naziv: smestaj.naziv,
          grad: smestaj.grad,
          cena: smestaj.cenaPoNocenju,
          opis: smestaj.opis
        };
      });
      
      return showData;
     

    } catch (error) {
      console.log(error);
      throw error;
    }
  };