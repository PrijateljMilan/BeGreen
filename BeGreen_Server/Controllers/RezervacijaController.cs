using Microsoft.AspNetCore.Authorization;

namespace BeGreen_Server.Controllers;

[ApiController]
[Route("[controller]")]
public class RezervacijaController : ControllerBase
{
    private readonly Context _context;
    public RezervacijaController(Context context)
    {
        _context = context;
    }

    [HttpGet("VratiRezervaciju/{RezervacijaID}")]
    public async Task<ActionResult<Rezervacija>> VratiRezervaciju(int RezervacijaID)
    {
        var rezervacija = await _context.Rezervacije!.FindAsync(RezervacijaID);
        if (rezervacija == null)
        {
            return BadRequest("Nije pronadjena rezervacija !");
        }
        return Ok(rezervacija);
    }


    [HttpGet("VratiSveRezervacije/{username}"), Authorize(Roles = "Korisnik")]
    public async Task<ActionResult> VratiSveRezervacije(string username)
    {
        try
        {
            var korisnik = await _context.Korisnici.FirstOrDefaultAsync(p => p.KorisnickoIme == username);
            if (korisnik == null)
            {
                return BadRequest("Korisnik ne postoji!");
            }

            var rezervacije = await _context.Rezervacije
                .Include(r => r.Smestaj)
                .Where(r => r.Korisnik.ID == korisnik.ID)
                .Select(r => new
                {
                    ID = r.ID,
                    Naziv = r.Smestaj.Naziv,
                    Grad = r.Smestaj.Grad,
                    Adresa = r.Smestaj.Adresa,
                    UkupnaCena = r.UkupnaCena,
                    DatumDolaska = r.DatumDolaska,
                    DatumOdlaska = r.DatumOdlaska,
                    KorisnickoIme = r.Smestaj.Vlasnik.KorisnickoIme,
                    BrojTelefona = r.Smestaj.Vlasnik.BrojTelefona,
                })
                .ToListAsync();

            return Ok(rezervacije);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("VratiSveRezervacijeVlasniku/{username}"), Authorize(Roles = "Vlasnik")]
    public async Task<ActionResult> VratiSveRezervacijeVlasniku(string username)
    {
        try
        {
            var vlasnik = await _context.Vlasnici.FirstOrDefaultAsync(p => p.KorisnickoIme == username);
            if (vlasnik == null)
            {
                return BadRequest("Vlasnik ne postoji!");
            }

            var rezervacije = await _context.Rezervacije
                .Include(r => r.Smestaj)
                .Where(r => r.Smestaj.Vlasnik.ID == vlasnik.ID)
                .Select(r => new
                {
                    ID = r.ID,
                    Naziv = r.Smestaj.Naziv,
                    Grad = r.Smestaj.Grad,
                    Adresa = r.Smestaj.Adresa,
                    UkupnaCena = r.UkupnaCena,
                    DatumDolaska = r.DatumDolaska,
                    DatumOdlaska = r.DatumOdlaska,
                    KorisnickoImeKorisnika = r.Korisnik.KorisnickoIme,
                    BrojTelefonaKorisnika = r.Korisnik.BrojTelefona,
                    BrojSvidjanja = r.Smestaj.BrojSvidjanja
                })
                .ToListAsync();

            return Ok(rezervacije);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }



    [HttpPost("DodajRezervaciju/{smestajID}/{usernameKorisnik}"), Authorize(Roles = "Korisnik")]
    public async Task<ActionResult<Rezervacija>> RezervisiSmestaj([FromBody] RezervacijaDTO rez, int smestajID, string usernameKorisnik)
    {
        try
        {
            var smestaj = await _context!.Smestaji!.FindAsync(smestajID);
            var korisnik = await _context!.Korisnici!.Where(p => p.KorisnickoIme == usernameKorisnik).FirstAsync();

            if (smestaj == null && korisnik == null)
            {
                return BadRequest("Smestaj i korisnik ne postoje");

            }
            var rezervacijaPostoji = await _context.Rezervacije.AnyAsync(r => r.Smestaj.ID == smestajID && r.DatumDolaska <= rez.DatumOdlaska && r.DatumOdlaska >= rez.DatumDolaska);
            /*Ova dva uslova zajedno obezbeđuju da neće biti preklapanja između
             postojećih rezervacija i nove rezervacije, što sprečava situaciju u kojoj se smestaj
              rezerviše za isti dan kada se prethodna rezervacija završava ili počinje.*/
            if (rezervacijaPostoji)
            {
                return BadRequest("Smestaj je već rezervisan za dati datum");
            }


            var novaRezervacija = new Rezervacija
            {
                DatumDolaska = rez.DatumDolaska,
                DatumOdlaska = rez.DatumOdlaska,
                //formula (od-do)*cenaPoNoci hahahahhaah(m.s.)
                UkupnaCena = rez.IzracunajUkupnuCenu(rez.DatumDolaska, rez.DatumOdlaska, smestaj.CenaPoNocenju), 
                Smestaj = smestaj,
                Korisnik = korisnik

            };

            _context.Rezervacije!.Add(novaRezervacija);
            await _context.SaveChangesAsync();

            return Ok("Uspesno ste rezervisali smestaj!");

        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    [HttpDelete("ObrisiRezervaciju/{rezervacijaID}")]
    public async Task<ActionResult> ObrisiRezervaciju(int rezervacijaID)
    {
        try
        {

            var rezervacija = await _context.Rezervacije!.FindAsync(rezervacijaID);
            if (rezervacija == null)
            {

                return BadRequest("Reservation not found !");
            }

            _context.Rezervacije.Remove(rezervacija);
            await _context.SaveChangesAsync();

            return Ok($"Rezervacija sa ID: {rezervacijaID} je uspesno izbrisan.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

}