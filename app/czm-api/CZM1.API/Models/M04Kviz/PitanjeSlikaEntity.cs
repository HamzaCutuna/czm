using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.M04Kviz;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kalendar;

/// <summary>
/// Predstavlja sliku povezanu sa određenim pitanjem.
/// </summary>
public partial class PitanjeSlikaEntity : BaseSlikaEntity
{
    /// <summary>
    /// ID pitanja kojem slika pripada.
    /// </summary>
    [ForeignKey(nameof(Pitanje))]
    public int PitanjeId { get; set; }
    public PitanjeEntity Pitanje { get; set; } = default!;
}
