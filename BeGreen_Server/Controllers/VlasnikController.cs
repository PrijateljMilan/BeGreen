using Microsoft.AspNetCore.Authorization;
namespace BeGreen_Server.Controllers;
using System.Security.Cryptography;

[ApiController]
[Route("[controller]")]
public class VlasnikController : ControllerBase
{
    
    private readonly Context _context;
    public VlasnikController(Context context)
    {
        _context = context;
    }


    [HttpGet("VratiVlasnika/{IdKor}")]
    public async Task<ActionResult<Vlasnik>> VratiVlasnika(int IdKor)
    {
        var vlasnik = await _context.Vlasnici!.FindAsync(IdKor);
        if (vlasnik == null)
        {
            return BadRequest("User not found !");
        }

        return Ok(vlasnik.KorisnickoIme);
    }

    [HttpGet("VratiSveVlasnike")]
    public async Task<ActionResult> VratiSveVlasnike()
    {
        try
        {
            return Ok(await _context.Vlasnici!.Select(p => 
            new
            {
                Id = p.ID,
                Ime = p.Ime,
                Prezime = p.Prezime,
                KorisnickoIme = p.KorisnickoIme,
                Email = p.Email,
                BrojTelefona = p.BrojTelefona
            }
            ).ToListAsync());
        }
        catch(Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("IzbrisiVlasnika/{IdVla}"),Authorize(Roles = "Admin")]
    public async Task<ActionResult<Vlasnik>> IzbrisiVlasnika(int IdVla)
    {
        var vlasnik = await _context.Vlasnici!.FindAsync(IdVla);
        var ki = vlasnik!.KorisnickoIme;
        if (vlasnik == null)
        {

            return BadRequest("User not found !");
        }
        
       

        _context.Vlasnici.Remove(vlasnik);
        await _context.SaveChangesAsync();

        return Ok($"Vlasnik sa korisnickim imenom: {ki} je uspesno izbrisan.");
    }


    [HttpPut("IzmeniVlasnika/{vlasnikID}"), Authorize(Roles = "Admin")]
    public async Task<ActionResult<Vlasnik>> IzmeniVlasnika(int vlasnikID, [FromForm] UserForma izmenjenVlasnik)
    {
        try
        {
            var vlasnik = await _context.Vlasnici.FirstOrDefaultAsync(s => s.ID == vlasnikID);

            if (vlasnik != null)
            {

                vlasnik.Ime = izmenjenVlasnik.Ime;
                vlasnik.Prezime = izmenjenVlasnik.Prezime;
                vlasnik.KorisnickoIme = izmenjenVlasnik.KorisnickoIme;
                vlasnik.Email = izmenjenVlasnik.Email;
                CreatePasswordHash(izmenjenVlasnik.Lozinka, out byte[] passwordHash, out byte[] passwordSalt);
                vlasnik.PasswordHash = passwordHash;
                vlasnik.PasswordSalt = passwordSalt;
                vlasnik.BrojTelefona = izmenjenVlasnik.BrojTelefona;



                _context.Vlasnici.Update(vlasnik);
                await _context.SaveChangesAsync();
                return Ok(vlasnik);
            }
            else
            {
                return BadRequest($"korisnik sa ID: {vlasnikID} se ne nalazi u bazi!");
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