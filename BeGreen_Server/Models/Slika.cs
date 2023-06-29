
public class Slika 
{
    public int ID { get; set; }
    public required string Naziv { get; set; }
    public required string Putanja { get; set; }
    [JsonIgnore]
    public Smestaj Smestaj { get; set; }
   
}