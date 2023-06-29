using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace BeGreen_Server.Controllers;
[Route("api/[controller]")]
[ApiController]

public class AuthController : ControllerBase
{

    private readonly IConfiguration _configuration;
    private readonly Context _context;
    public AuthController(Context context, IConfiguration configuration)
    {
        _configuration = configuration;
        _context = context;
    }

    [HttpPost("registerA")]
    public async Task<ActionResult<Admin>> RegisterA(RegistracijaAdminDTO request)
    {

        bool ve = ValidateEmail(request.Email);
        if (ve == false)
        {
            return BadRequest("Email koji ste uneli nije validan!");
        }
        Admin admin = new Admin()
        {
            KorisnickoIme = request.KorisnickoIme,
            Email = request.Email,
            Role = request.Role

        };
        CreatePasswordHash(request.Lozinka, out byte[] passwordHash, out byte[] passwordSalt);
        admin.KorisnickoIme = request.KorisnickoIme;
        admin.PasswordHash = passwordHash;
        admin.PasswordSalt = passwordSalt;
        var ad = await _context.Korisnici!.FindAsync(admin.ID);

        _context.Admini!.Add(admin);
        await _context.SaveChangesAsync();

        return Ok(ad);
    }


    [HttpPost("register")]
    public async Task<ActionResult<Korisnik>> Register(RegistracijaDTO request)
    {

        List<string> errors = new List<string>();

        bool vime = ValidateIme(request.Ime);
        if (vime == false)
        {
            errors.Add("Ime koje ste uneli nije validno");
        }

        bool vprez = ValidatePrezime(request.Prezime);
        if (vprez == false)
        {
            errors.Add("Prezime koje ste uneli nije validno");
        }

        var k = await _context.Korisnici.Where(p => p.KorisnickoIme == request.KorisnickoIme).FirstOrDefaultAsync();
        var v = await _context.Vlasnici.Where(p => p.KorisnickoIme == request.KorisnickoIme).FirstOrDefaultAsync();

        if (k != null || v != null)
        {
            errors.Add("Korisnicko ime koje ste uneli vec postoji");
        }


        bool vloz = ValidateLozinka(request.Lozinka);
        if (vloz == false)
        {
            errors.Add("Lozinku koju ste uneli nije validna");
        }

        if (request.PotvrdaLozinke != request.Lozinka)
        {

            errors.Add("Niste lepo ponovili lozinku");
        }


        bool ve = ValidateEmail(request.Email);
        if (ve == false)
        {
            errors.Add("Email koji ste uneli nije validan!");
        }

        bool vt = ValidatePhoneNumber(request.BrojTelefona);
        if (vt == false)
        {
            errors.Add("Broj telefona koji ste uneli nije validan!");
        }

        if (errors.Count > 0)
        {
            return BadRequest(string.Join(", ", errors));
        }

        Korisnik korisnik = new Korisnik()
        {
            Ime = request.Ime,
            Prezime = request.Prezime,
            KorisnickoIme = request.KorisnickoIme,
            Email = request.Email,
            BrojTelefona = request.BrojTelefona,
            Role = request.Role

        };
        CreatePasswordHash(request.Lozinka, out byte[] passwordHash, out byte[] passwordSalt);
        korisnik.KorisnickoIme = request.KorisnickoIme;
        korisnik.PasswordHash = passwordHash;
        korisnik.PasswordSalt = passwordSalt;
        var kor = await _context.Korisnici!.FindAsync(korisnik.ID);

        _context.Korisnici.Add(korisnik);
        await _context.SaveChangesAsync();

        return Ok(kor);
    }
    /*---------------------------------------------------------------Registracija za vlasnika*/

    public static bool ValidateIme(string ime)
    {
        var regex = @"^[A-Z][a-z]*$";
        bool isValid = Regex.IsMatch(ime, regex);
        return isValid;

    }

    public static bool ValidatePrezime(string prezime)
    {
        var regex = @"^[A-Z][a-z]*$";
        bool isValid = Regex.IsMatch(prezime, regex);
        return isValid;
    }


    public static bool ValidateLozinka(string lozinka)
    {
        var regex = @"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";
        bool isValid = Regex.IsMatch(lozinka, regex);
        return isValid;
    }


    public static bool ValidateEmail(string emailAddress)
    {
        var regex = @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z";
        bool isValid = Regex.IsMatch(emailAddress, regex, RegexOptions.IgnoreCase);
        return isValid;
    }

    public static bool ValidatePhoneNumber(string phoneNumber)
    {
        var regex = @"^06\d{6,9}$";
        bool isValid = Regex.IsMatch(phoneNumber, regex, RegexOptions.IgnoreCase);
        return isValid;
    }
    [HttpPost("registerV")]
    public async Task<ActionResult<Vlasnik>> RegisterV(RegistracijaDTO request)
    {
        try{
        List<string> errors = new List<string>();

        bool vime = ValidateIme(request.Ime);
        if (vime == false)
        {
            errors.Add("Ime koje ste uneli nije validno");
        }

        bool vprez = ValidatePrezime(request.Prezime);
        if (vprez == false)
        {
            errors.Add("Prezime koje ste uneli nije validno");
        }

        var k = await _context.Korisnici.Where(p => p.KorisnickoIme == request.KorisnickoIme).FirstOrDefaultAsync();
        var v = await _context.Vlasnici.Where(p => p.KorisnickoIme == request.KorisnickoIme).FirstOrDefaultAsync();

        if (k != null || v != null)
        {
            errors.Add("Korisnicko ime koje ste uneli vec postoji");
        }


        bool vloz = ValidateLozinka(request.Lozinka);
        if (vloz == false)
        {
            errors.Add("Lozinku koju ste uneli nije validna");
        }

        if (request.PotvrdaLozinke != request.Lozinka)
        {

            errors.Add("Niste lepo ponovili lozinku");
        }


        bool ve = ValidateEmail(request.Email);
        if (ve == false)
        {
            errors.Add("Email koji ste uneli nije validan!");
        }

        bool vt = ValidatePhoneNumber(request.BrojTelefona);
        if (vt == false)
        {
            errors.Add("Broj telefona koji ste uneli nije validan!");
        }

        if (errors.Count > 0)
        {
            return BadRequest(string.Join(", ", errors));
        }

        Vlasnik vlasnik = new Vlasnik()
        {
            Ime = request.Ime,
            Prezime = request.Prezime,
            KorisnickoIme = request.KorisnickoIme,
            Email = request.Email,
            BrojTelefona = request.BrojTelefona,
            Role = request.Role

        };
        CreatePasswordHash(request.Lozinka, out byte[] passwordHash, out byte[] passwordSalt);
        vlasnik.KorisnickoIme = request.KorisnickoIme;
        vlasnik.PasswordHash = passwordHash;
        vlasnik.PasswordSalt = passwordSalt;
        var kor = await _context.Korisnici!.FindAsync(vlasnik.ID);

        _context.Vlasnici!.Add(vlasnik);
        await _context.SaveChangesAsync();

        return Ok(kor);
        }
        catch(Exception e){
            return BadRequest(e.Message);
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<object>> Login(LoginDTO request)
    {
        var admin = await _context.Admini!.FirstOrDefaultAsync(a => a.KorisnickoIme == request.KorisnickoIme);
        var user = await _context.Korisnici!.FirstOrDefaultAsync(u => u.KorisnickoIme == request.KorisnickoIme);
        var userV = await _context.Vlasnici!.FirstOrDefaultAsync(u => u.KorisnickoIme == request.KorisnickoIme);

        if (admin != null)
        {
            if (!VeryfyPasswordHash(request.Lozinka, admin.PasswordHash, admin.PasswordSalt))
            {
                return BadRequest("Wrong password.");
            }

            var tokenA = CreateTokenA(admin);
            return new { tokenA };
        }


        else if (user != null)
        {
            if (!VeryfyPasswordHash(request.Lozinka, user.PasswordHash, user.PasswordSalt))
            {
                return BadRequest("Wrong password.");
            }

            var token = CreateToken(user);
            return new { token };
        }

        else if (userV != null)
        {

            if (!VeryfyPasswordHash(request.Lozinka, userV.PasswordHash, userV.PasswordSalt))
            {
                return BadRequest("Wrong password.");
            }

            var tokenV = CreateTokenV(userV);
            return new { tokenV };
        }

        return BadRequest("User not found.");
    }
    private string CreateToken(Korisnik user)
    {
        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.KorisnickoIme),
        new Claim(ClaimTypes.Role, user.Role)
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration.GetSection("AppSettings:Token").Value));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var jwt = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
    private string CreateTokenA(Admin user)
    {
        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.KorisnickoIme),
        new Claim(ClaimTypes.Role, user.Role)
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration.GetSection("AppSettings:Token").Value));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var jwt = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    private string CreateTokenV(Vlasnik user)
    {
        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.KorisnickoIme),
        new Claim(ClaimTypes.Role, user.Role)
    };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration.GetSection("AppSettings:Token").Value));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var jwt = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    [HttpGet("Preuzmi"), Authorize(Roles = "Korisnik , Vlasnik, Admin")]
    public ActionResult<string> GetMe()
    {
        var userName = User?.Identity?.Name;
        return Ok(userName);
    }

    [HttpGet("ProveriKorisnickoIme/{korisnickoIme}")]
    public async Task<ActionResult> ProveriKorisnickoIme(string korisnickoIme)
    {
        try
        {
            List<Korisnik> korisnik = new List<Korisnik>();
            List<Vlasnik> vlasnik = new List<Vlasnik>();

            bool k = await _context.Korisnici.AnyAsync(p => p.KorisnickoIme == korisnickoIme);
            bool v = await _context.Vlasnici.AnyAsync(p => p.KorisnickoIme == korisnickoIme);

            if (k || v)
            {
                return BadRequest("Vec postoji unsername pod nazivom: " + korisnickoIme + "!");
            }
            else
            {
                return Ok("Uspesno dodat username: " + korisnickoIme + ".");
            }

        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
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

    private bool VeryfyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
        using (var hmac = new HMACSHA512(passwordSalt))
        {
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(passwordHash);
        }
    }


}
