using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.Korisnici;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Novosti;

/// <summary>
/// Predstavlja novost ili obavijest sa naslovom, tekstom, datumom i pripadajućim slikama.
/// </summary>
public partial class NovostEntity : AuditableBaseEntity
{
    [ForeignKey(nameof(Korisnik))]
    public int KorisnikId { get; set; }
    public KorisnikEntity Korisnik { get; set; } = default!;

    /// <summary>
    /// Naslov novosti.
    /// </summary>
    [MaxLength(128)]
    public required string Naslov { get; set; }

    /// <summary>
    /// Sadržaj teksta novosti.
    /// </summary>
    [MaxLength(4000)]
    public required string Tekst { get; set; }

    /// <summary>
    /// Datum na koji se novost odnosi.
    /// </summary>
    public required DateOnly DatumNaObavijestiUtc { get; set; }

    /// <summary>
    /// Kolekcija slika povezanih s novosti.
    /// </summary>
    public virtual ICollection<NovostSlikaEntity> NovostiSlikes { get; set; } = [];
}
