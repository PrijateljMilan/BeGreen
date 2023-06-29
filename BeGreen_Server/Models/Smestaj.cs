

public class Smestaj 
{
    public int ID { get; set; }
    public required string Naziv { get; set; }
    public required string Grad { get; set; }
    public required string Adresa { get; set; }
    public int BrojSoba { get; set; }
    public float CenaPoNocenju { get; set; }
    public required string Opis { get; set; }
    public required int BrojSvidjanja { get; set; }
    public required Vlasnik Vlasnik { get; set; }

    [JsonIgnore]
    public  List<Rezervacija>? Rezervacije { get; set; }
    
    public List<Slika>? Slike {get; set;}

}