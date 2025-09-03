using CZM1.API.Data.BaseClasses;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kalendar;

/// <summary>
/// Predstavlja sliku povezanu sa određenim historijskim događajem.
/// </summary>
public partial class HistorijskiDogadjajSlikaEntity : BaseSlikaEntity
{
    /// <summary>
    /// ID događaja kojem slika pripada. (optional)
    /// </summary>
    [ForeignKey(nameof(HistorijskiDogadjajInfo))]
    public int HistorijskiDogadjajInfoId { get; set; }
    public HistorijskiDogadjajEntity HistorijskiDogadjajInfo { get; set; } = default!;
}
