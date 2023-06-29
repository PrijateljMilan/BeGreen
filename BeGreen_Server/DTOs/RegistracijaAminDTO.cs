public class RegistracijaAdminDTO
{
 
    [Required(ErrorMessage = "Polje Ime je obavezno.")]
    public string KorisnickoIme { get; set; }

    [Required(ErrorMessage = "Polje Email je obavezno.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Polje Lozinka je obavezno.")]
    //[MinLength(8, ErrorMessage = "Lozinka mora sadržati najmanje 8 karaktera.")]
    public string Lozinka { get; set; }
    [Required(ErrorMessage = "Polje PotvrdaLozinke je obavezno.")] 
    [Compare("Lozinka", ErrorMessage = "Lozinka i potvrda lozinke se ne poklapaju.")] 
    public string PotvrdaLozinke { get; set; }


    public string Role { get; set; }
    
}