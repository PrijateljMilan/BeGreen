public class RecenzijaDTO{

    public string? Naslov { get; set; }
    public string? Komentar { get; set; }
    [Range(1,5)]
    public int Ocena { get; set; }
    
}