using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.M04Kviz;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kviz;

/// <summary>
/// Predstavlja korisnički odgovor na konkretno pitanje u okviru određenog kviza.
/// </summary>
public partial class KvizRezultatKorisnickiOdgovorEntity : AuditableBaseEntity
{
    /// <summary>
    /// ID pitanja na koje se odgovor odnosi.
    /// </summary>
    [ForeignKey(nameof(Pitanje))]
    public int PitanjeId { get; set; }
    public PitanjeEntity Pitanje { get; set; } = default!;

    /// <summary>
    /// ID rezultata kviza kojem pripada ovaj odgovor.
    /// </summary>
    [ForeignKey(nameof(Rezultat))]
    public int RezultatId { get; set; }
    public KvizRezultatEntity Rezultat { get; set; } = default!;

    /// <summary>
    /// ID odgovora koji je korisnik odabrao. (optional)
    /// </summary>
    [ForeignKey(nameof(Odgovor))]
    public int? OdgovorId { get; set; }
    public PitanjaPonudjenaOpcijaEntity? Odgovor { get; set; }

    /// <summary>
    /// Da li je korisnikov odgovor bio tačan.
    /// </summary>
    public bool Tacno { get; set; }
}
