public class RezervacijaDTO
{
    public DateTime DatumDolaska { get; set; }
    public DateTime DatumOdlaska { get; set; }


    public float IzracunajUkupnuCenu(DateTime datumDolaska, DateTime datumOdlaska, float cenaPoNoci)
    {
        TimeSpan trajanje = datumOdlaska - datumDolaska;
        int brojDana = (int)trajanje.TotalDays;
        float ukupnaCena = brojDana * cenaPoNoci;
        return ukupnaCena;
    }
}