using System.ComponentModel.DataAnnotations;

namespace CZM1.API.Data.BaseClasses;

/// <summary>
/// Bazna klasa za entitete koji predstavljaju slike sa zajedničkim poljima.
/// </summary>
public abstract class BaseSlikaEntity : AuditableBaseEntity
{
    /// <summary>
    /// URL slike.
    /// </summary>
    [MaxLength(1024)]
    public required string SlikaPath { get; set; }
    /// <summary>
    /// Informacija o izvoru slike. (optional)
    /// </summary>
    [MaxLength(1024)]
    public required string? IzvorInfo { get; set; }

    /// <summary>
    /// URL izvora slike. (optional)
    /// </summary>
    [MaxLength(512)]
    public required string? IzvorUrl { get; set; }
    /// <summary>
    /// Redoslijed prikaza slike.
    /// </summary>
    public required int Redoslijed { get; set; }
}
