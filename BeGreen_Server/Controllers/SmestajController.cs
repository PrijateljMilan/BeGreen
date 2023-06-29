namespace BeGreen_Server.Controllers;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("[controller]")]
public class SmestajController : ControllerBase
{
    private readonly Context _context;
    private readonly IWebHostEnvironment _env;

    public SmestajController(Context context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpPost("Create"), Authorize(Roles = "Vlasnik")]
    public async Task<ActionResult<Smestaj>> CreateSmestaj([FromForm] SmestajForma vik, [FromForm] List<IFormFile> files, [FromForm] string username)
    {
        try
        {
            // Provera da li postoji vlasnik
            var Vlas = await _context.Vlasnici!.Where(p => p.KorisnickoIme == username).FirstAsync();
            if (Vlas == null)
            {
                return BadRequest("Vlasnik ne postoji");
            }

            // Provera da li postoji vikendica
            var vikendica = await _context.Smestaji!.Where(p => p.Naziv == vik.Naziv).FirstOrDefaultAsync();
            if (vikendica != null)
            {
                return BadRequest("Vikendica vec postoji!");
            }

            var slike = new List<Slika>();

            foreach (var file in files)
            {
                var filePath = Path.Combine(_env.WebRootPath, "Images", file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var novaSlika = new Slika { Putanja = filePath, Naziv = file.FileName };
                _context.Slike!.Add(novaSlika);
                slike.Add(novaSlika);
            }

            // Kreiranje nove vikendice
            var novaVikendica = new Smestaj
            {
                Vlasnik = Vlas,
                Naziv = vik.Naziv,
                Grad = vik.Grad,
                Adresa = vik.Adresa,
                BrojSoba = vik.BrojSoba,
                CenaPoNocenju = vik.CenaPoNocenju,
                Opis = vik.Opis,
                BrojSvidjanja = 0,
                Slike = slike
            };

            // Čitanje i spremanje datoteka
            _context.Smestaji!.Add(novaVikendica);
            await _context.SaveChangesAsync();

            return Ok(novaVikendica);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("ObrisiSmestaj/{smestajID}"), Authorize(Roles = "Vlasnik")]
    public async Task<ActionResult> ObrisiSmestaj(int smestajID)
    {
        try
        {

            var smestaj = await _context.Smestaji!.FindAsync(smestajID);
            if (smestaj == null)
            {

                return BadRequest("Reservation not found !");
            }

            _context.Smestaji.Remove(smestaj);
            await _context.SaveChangesAsync();

            return Ok($"Smestaj sa ID: {smestajID} je uspesno izbrisan.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPut("IzmeniSmestaj/{smestajID}"), Authorize(Roles = "Vlasnik")]
    public async Task<ActionResult<Smestaj>> IzmeniSmestaj(int smestajID, [FromForm] SmestajForma izmenjenSmestaj, [FromForm] List<IFormFile> files)
    {
        try
        {
            var smestaj = await _context.Smestaji.Include(s => s.Slike).FirstOrDefaultAsync(s => s.ID == smestajID);

            if (smestaj != null)
            {
                smestaj.Naziv = izmenjenSmestaj.Naziv;
                smestaj.Grad = izmenjenSmestaj.Grad;
                smestaj.Adresa = izmenjenSmestaj.Adresa;
                smestaj.BrojSoba = izmenjenSmestaj.BrojSoba;
                smestaj.CenaPoNocenju = izmenjenSmestaj.CenaPoNocenju;
                smestaj.Opis = izmenjenSmestaj.Opis;

                //Azuriranje slika vikendice
                if (files != null && files.Count > 0)
                {
                    //Brisanje postojecih slika vikendice

                    foreach (var slika in smestaj.Slike)
                    {
                        _context.Slike.Remove(slika);
                    }
                    //Dodavanje novih slika vikendice
                    foreach (var file in files)
                    {
                        var filePath = Path.Combine(_env.WebRootPath, "Images", file.FileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var novaSlika = new Slika { Putanja = filePath, Naziv = file.FileName };
                        smestaj.Slike.Add(novaSlika);
                        _context.Slike.Add(novaSlika);
                    }

                }
                _context.Smestaji.Update(smestaj);
                await _context.SaveChangesAsync();
                return Ok(smestaj);
            }
            else
            {
                return BadRequest($"Smestaj sa ID: {smestajID} se ne nalazi u bazi!");
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    [HttpGet("PreuzmiSmestaj/{username}"), Authorize(Roles = "Vlasnik")]
    public async Task<ActionResult<List<Smestaj>>> PreuzmiSmestaj(string username)
    {
        try
        {
            var vlasnik = await _context.Vlasnici!.Where(p => p.KorisnickoIme == username).FirstAsync();
            var vlasnikId = vlasnik.ID;
            if (vlasnik == null)
            {
                return BadRequest("Korisnik nije pronadjen !");
            }

            var smestaji = await _context.Smestaji!
                .Where(p => p.Vlasnik.ID == vlasnikId)
                .OrderByDescending(v => v.CenaPoNocenju)
                .Select(v => new { v.ID, v.Slike, v.Naziv, v.Grad, v.CenaPoNocenju, v.Opis, v.BrojSvidjanja })
                .ToListAsync();

            return Ok(smestaji);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpGet("PreuzmiGradove")]
    public async Task<ActionResult> PreuzmiGradove()
    {
        try
        {

            var gradovi = await _context.Smestaji!
                .OrderByDescending(v => v.CenaPoNocenju)
                .Select(v => new { v.Grad })
                .Distinct() //da ne vraca duplikate
                .ToListAsync();

            if (gradovi == null)
            {
                return Ok(" "); // ako je inicijalno i nema nista u bazi vrati prazno da ne pukne
            }

            return Ok(gradovi);
        }
        catch (Exception e)
        {
            return BadRequest(e);
        }
    }

    [HttpGet("PreuzmiSliku/{id}")]
    public async Task<IActionResult> PreuzmiSliku(int id)
    {
        var slika = await _context.Slike!.FindAsync(id);
        if (slika == null)
        {
            return NotFound();
        }

        var filePath = Path.Combine(_env.WebRootPath, slika.Putanja);

        var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

        return File(stream, "image/jpeg");
    }

    [HttpPost("PretraziSmestaje")]
    public async Task<ActionResult<List<Smestaj>>> PretraziSmestaje([FromForm] PretragaForma pf) //korisnickoIme
    {
        try
        {
            //pronaci sve smestaje gde rezervacija nema datum kao datum koji je unet
            var smestaji = await _context!.Smestaji!.ToListAsync();
            var odgovarajuciSmestaji = new List<Smestaj>();
            var rezervacije = new List<Rezervacija>();
            var danasniDatum = DateTime.Now;
            if(pf.DatumOd < danasniDatum || pf.DatumDo < danasniDatum || pf.DatumDo == pf.DatumOd)
            {   
                return BadRequest("Pogresno unet datum!");
            }
            else
            {
                foreach (var smestaj in smestaji)
                {
                    bool rezervacijaPostoji = await _context.Rezervacije.AnyAsync(r =>
                        r.Smestaj.ID == smestaj.ID &&
                        (r.DatumDolaska <= pf.DatumDo && r.DatumOdlaska >= pf.DatumOd));

                    if (!rezervacijaPostoji && smestaj.Grad == pf.Grad && smestaj.BrojSoba == pf.BrojSoba)
                    {
                        smestaj.Slike = await _context.Slike.Where(slika => slika.Smestaj.ID == smestaj.ID).ToListAsync();
                        odgovarajuciSmestaji.Add(smestaj);
                    }
                }

                if (odgovarajuciSmestaji.Count == 0)
                {
                    return BadRequest(new { error = "Nema dostupnih smestaja!" });
                }
                else
                {
                    var smestajiSort = odgovarajuciSmestaji
                        .OrderByDescending(v => v.CenaPoNocenju)
                        .ToList();

                    return Ok(smestajiSort);
                }
            }

        }
        catch (Exception e)
        {
            return BadRequest("Nema dostupnih smestaja!");
        }
    }


    [HttpGet("PreuzmiTopSmestaje")]
    public async Task<ActionResult<List<Smestaj>>> PreuzmiTopSmestaje()
    {
        var smestaji = await _context.Smestaji
            .OrderByDescending(v => v.BrojSvidjanja)
            .Take(4)
            .Select(v => new { v.ID, v.Slike, v.Naziv, v.Grad, v.CenaPoNocenju, v.Opis, v.BrojSvidjanja })
            .ToListAsync();

        return Ok(smestaji);
    }

    [HttpPost("Lajkuj/{SmestajID}"), Authorize(Roles = "Korisnik")]
    public async Task<ActionResult> Lajkuj(int SmestajID)
    {
        try
        {
            var smestaj = await _context.Smestaji.FindAsync(SmestajID);
            if (smestaj != null)
            {
                smestaj.BrojSvidjanja = smestaj.BrojSvidjanja + 1;
                _context.Smestaji.Update(smestaj);
                await _context.SaveChangesAsync();
                return Ok("Smestaj sa ID: " + SmestajID + "je azuriran!");
            }
            else
            {
                return BadRequest("Smestaj sa ID: " + SmestajID + "nije pronadjen!");
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

}