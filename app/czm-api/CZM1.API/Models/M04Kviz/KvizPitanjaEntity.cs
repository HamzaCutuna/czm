using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.Kalendar;
using CZM1.API.Models.M04Kviz;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kviz;

/// <summary>
/// Povezivanje pitanja i kviza
/// </summary>
public partial class KvizPitanjaEntity : AuditableBaseEntity
{
    /// <summary>
    /// ID kviza kojem pitanje pripada.
    /// </summary>
    [ForeignKey(nameof(Kviz))]
    public int KvizId { get; set; }
    public KvizEntity Kviz { get; set; } = default!;

    /// <summary>
    /// ID pitanja koje je dio kviza.
    /// </summary>
    [ForeignKey(nameof(Pitanje))]
    public int PitanjeId { get; set; }
    public PitanjeEntity Pitanje { get; set; } = default!;
}
