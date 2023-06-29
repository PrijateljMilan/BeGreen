public class Vlasnik 
{
    public int ID { get; set; }
    public required string Ime { get; set; } 
    public required string Prezime { get; set; }
    public required string KorisnickoIme { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
    public required string Email { get; set; }
    // public required string Lozinka { get; set; }
    public required string BrojTelefona { get; set; }
    public required string Role { get; set; }
    [JsonIgnore]
    public List<Smestaj>? Smestaji { get; set; }
}