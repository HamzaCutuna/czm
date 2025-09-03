using CZM1.API.Data.BaseClasses;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Korisnici;

/// <summary>
/// Token koji predstavlja autentifikacioni zapis korisnika, uključujući IP adresu i vrijeme kreiranja.
/// </summary>
public class AutentikacijaTokenEntity : BaseEntity
{
    /// <summary>
    /// Vrijednost tokena.
    /// </summary>
    [MaxLength(64)]
    public required string Value { get; set; }

    /// <summary>
    /// IP adresa klijenta. 
    /// </summary>
    [MaxLength(64)]
    public string IpAddress { get; set; } = string.Empty;

    /// <summary>
    /// Vrijeme kada je token evidentiran.
    /// </summary>
    public DateTime RecordedAtUtc { get; set; }

    /// <summary>
    /// ID korisnika na kojeg se token odnosi.
    /// </summary>
    [ForeignKey(nameof(Korisnik))]
    public int KorisnikId { get; set; }
    public KorisnikEntity Korisnik { get; set; } = default!;
}
