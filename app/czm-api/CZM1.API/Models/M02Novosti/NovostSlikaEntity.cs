using CZM1.API.Data.BaseClasses;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Novosti;

/// <summary>
/// Predstavlja sliku povezanu sa određenom novosti.
/// </summary>
public partial class NovostSlikaEntity : BaseSlikaEntity
{
    /// <summary>
    /// ID novosti kojoj slika pripada.
    /// </summary>
    [ForeignKey(nameof(Novost))]
    public int NovostId { get; set; }
    public NovostEntity Novost { get; set; } = default!;
 
}
