public class RegistracijaDTO
{
    [Required(ErrorMessage = "Polje Ime je obavezno.")]
    public string Ime { get; set; }
    [Required(ErrorMessage = "Polje prezime je obavezno.")]
    public string Prezime { get; set; }
    [Required(ErrorMessage = "Polje Ime je obavezno.")]
    public string KorisnickoIme { get; set; }

    [Required(ErrorMessage = "Polje Email je obavezno.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Polje Lozinka je obavezno.")]
    //[MinLength(8, ErrorMessage = "Lozinka mora sadržati najmanje 8 karaktera.")]
    public string Lozinka { get; set; }
    //  [Compare("Lozinka", ErrorMessage = "Lozinka i potvrda lozinke se ne poklapaju.")] 
    public string PotvrdaLozinke { get; set; }

    [Required(ErrorMessage = "Morate uneti broj telefona.")]
    // [RegularExpression(@"^[+]?\d{10,15}$", ErrorMessage = "Broj telefona nije validan.")]
    public string BrojTelefona { get; set; }

    public string Role { get; set; }
    
}