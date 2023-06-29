using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace BeGreen_Server.Controllers;

[ApiController]
[Route("[controller]")]
public class KorisnikController : ControllerBase
{
    private readonly Context _context;
    public KorisnikController(Context context)
    {
        _context = context;
    }

    [HttpGet("VratiKorisnika/{IdKor}")]
    public async Task<ActionResult<Korisnik>> VratiKorisnika(int IdKor)
    {
        var korisnik = await _context.Korisnici!.FindAsync(IdKor);
        if (korisnik == null)
        {
            return BadRequest("User not found !");
        }

        return Ok(korisnik.KorisnickoIme);
    }

    [HttpGet("VratiSveKorisnike")]
    public async Task<ActionResult> VratiSveKorisnike()
    {
        try
        {
            return Ok(await _context.Korisnici!.Select(p =>
            new
            {
                ID = p.ID,
                Ime = p.Ime,
                Prezime = p.Prezime,
                KorisnickoIme = p.KorisnickoIme,
                Email = p.Email,
                BrojTelefona = p.BrojTelefona
            }
            ).ToListAsync());
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }


    [HttpDelete("IzbrisiKorisnika/{IdKor}"), Authorize(Roles = "Admin")]
    public async Task<ActionResult<Korisnik>> IzbrisiKorisnika(int IdKor)
    {
        var korisnik = await _context.Korisnici!.FindAsync(IdKor);
        var ki = korisnik!.KorisnickoIme;
        if (korisnik == null)
        {

            return BadRequest("User not found !");
        }


        _context.Korisnici.Remove(korisnik);
        await _context.SaveChangesAsync();

        return Ok($"Korisnik sa korisnickim imenom: {ki} je uspesno izbrisan.");
    }

 

    [HttpPut("IzmeniKorisnika/{korisnikID}"), Authorize(Roles = "Admin")]
    public async Task<ActionResult<Korisnik>> IzmeniKorisnika(int korisnikID, [FromForm] UserForma izmenjenUser)
    {
        try
        {
            var korisnik = await _context.Korisnici.FirstOrDefaultAsync(s => s.ID == korisnikID);

            if (korisnik != null)
            {

                korisnik.Ime = izmenjenUser.Ime;
                korisnik.Prezime = izmenjenUser.Prezime;
                korisnik.KorisnickoIme = izmenjenUser.KorisnickoIme;
                korisnik.Email = izmenjenUser.Email;
                CreatePasswordHash(izmenjenUser.Lozinka, out byte[] passwordHash, out byte[] passwordSalt);
                korisnik.PasswordHash = passwordHash;
                korisnik.PasswordSalt = passwordSalt;
                korisnik.BrojTelefona = izmenjenUser.BrojTelefona;



                _context.Korisnici.Update(korisnik);
                await _context.SaveChangesAsync();
                return Ok(korisnik);
            }
            else
            {
                return BadRequest($"korisnik sa ID: {korisnikID} se ne nalazi u bazi!");
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }
    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using (var hmac = new HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }

}
