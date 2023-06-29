public class Rezervacija 
{
    public int ID { get; set; }
    public DateTime DatumDolaska { get; set; }
    public DateTime DatumOdlaska { get; set; }
    public float UkupnaCena { get; set; }
  
    public required Smestaj Smestaj { get; set; }
   
    public required Korisnik Korisnik { get; set; }

    
}
