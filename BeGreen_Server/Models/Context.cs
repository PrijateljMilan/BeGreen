public class Context : DbContext
{

    public DbSet<Korisnik>? Korisnici { get; set; }
    public DbSet<Rezervacija>? Rezervacije { get; set; }
    public DbSet<Smestaj>? Smestaji { get; set; }
    public DbSet<Vlasnik>? Vlasnici { get; set; }
    public DbSet<Admin>? Admini { get; set; }
    public DbSet<Slika>? Slike { get; set; }


    public Context(DbContextOptions options) : base(options)
    {

    }

}