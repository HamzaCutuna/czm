using System.ComponentModel.DataAnnotations;

namespace CZM1.API.Data.BaseClasses;

/// <summary>
/// Bazna klasa za video entitete povezane sa raznim modulima (novosti, događaji, kviz, itd.).
/// </summary>
public abstract class BaseVideoEntity : AuditableBaseEntity
{
    /// <summary>
    /// URL videa.
    /// </summary>
    [MaxLength(512)]
    public required string VideoUrl { get; set; }

    /// <summary>
    /// Informacija o izvoru videa. (optional)
    /// </summary>
    [MaxLength(1024)]
    public required string? IzvorInfo { get; set; }

    /// <summary>
    /// URL izvora videoa. (optional)
    /// </summary>
    [MaxLength(512)]
    public required string? IzvorUrl { get; set; }

    /// <summary>
    /// Redoslijed prikaza videa.
    /// </summary>
    public required int Redoslijed { get; set; }

    /// <summary>
    /// Dužina video (sekundi)
    /// </summary>
    public required int VideoDuzinaSek { get; set; }

}
