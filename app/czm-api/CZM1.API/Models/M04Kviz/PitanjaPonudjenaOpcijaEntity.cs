using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.M04Kviz;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kviz;

/// <summary>
/// Predstavlja ponuđeni odgovor (opciju) na pitanje u okviru kviza.
/// </summary>
public partial class PitanjaPonudjenaOpcijaEntity : AuditableBaseEntity
{
    /// <summary>
    /// ID pitanja na koje se odgovor odnosi.
    /// </summary>
    [ForeignKey(nameof(Pitanje))]
    public int PitanjeId { get; set; }
    public PitanjeEntity Pitanje { get; set; } = default!;

    /// <summary>
    /// Tekst ponuđenog odgovora.
    /// </summary>
    [MaxLength(512)]
    public required string TekstOdgovora { get; set; }

    /// <summary>
    /// Da li je odgovor tačan.
    /// </summary>
    public bool Tacan { get; set; }
}
