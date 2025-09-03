using CZM1.API.Data.BaseClasses;
using System.ComponentModel.DataAnnotations;

namespace CZM1.API.Models.Kviz;

/// <summary>
/// Predstavlja kviz sa pripadajućim pitanjima.
/// </summary>
public partial class KvizEntity : AuditableBaseEntity
{
    /// <summary>
    /// Naziv kviza.
    /// </summary>
    [MaxLength(128)]
    public required string Naziv { get; set; }

    /// <summary>
    /// Opis kviza.
    /// </summary>
    [MaxLength(512)]
    public required string Opis { get; set; }

    /// <summary>
    /// Kolekcija pitanja u kvizu.
    /// </summary>
    public virtual ICollection<KvizPitanjaEntity> Pitanja { get; set; } = [];
}
