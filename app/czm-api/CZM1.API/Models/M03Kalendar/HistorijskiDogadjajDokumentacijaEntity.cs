using CZM1.API.Data.BaseClasses;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kalendar;

/// <summary>
/// Predstavlja eksternu dokumentaciju vezanu za određeni historijski događaj.
/// </summary>
public partial class HistorijskiDogadjajDokumentacijaEntity : AuditableBaseEntity
{
    /// <summary>
    /// ID historijskog događaja kojem dokumentacija pripada.
    /// </summary>
    [ForeignKey(nameof(HistorijskiDogadjaj))]
    public int HistorijskiDogadjajInfoId { get; set; }
    public HistorijskiDogadjajEntity HistorijskiDogadjaj { get; set; } = default!;

    /// <summary>
    /// URL dokumenta.
    /// </summary>
    [MaxLength(256)]
    public required string EksterniUrl { get; set; }

    /// <summary>
    /// Opis dokumentacije.
    /// </summary>
    [MaxLength(512)]
    public required string Opis { get; set; }

}
