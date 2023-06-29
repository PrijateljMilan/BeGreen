public class Korisnik 
{
    public int ID { get; set; }
    public required string Ime { get; set; } 
    public required string Prezime { get; set; }
    public required string KorisnickoIme { get; set; }

    // [RegularExpression(@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Email nije validan.")]
    [MaxLength(50)]
    public required string Email { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
   // public required string Lozinka { get; set; }  ==== Moze i na srpski

   [RegularExpression(@"^[+]?\d{10,15}$", ErrorMessage = "Broj telefona nije validan.")]
    public required string BrojTelefona { get; set; }
    public required string Role { get; set; }

    [JsonIgnore]
    public  List<Rezervacija>? Rezervacije { get; set; }
    

}