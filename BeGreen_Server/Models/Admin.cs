public class Admin
{
    public int ID { get; set; }
    public required string KorisnickoIme { get; set; }
    public required string Email { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
    public required string Role { get; set; }

}