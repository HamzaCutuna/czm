using System;
using System.ComponentModel.DataAnnotations;

namespace CZM1.API.Data.BaseClasses;

/// <summary>
/// Osnovna entitetska klasa koja sadrži primarni ključ i informacije o datumu kreiranja i izmjene.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Primarni ključ entiteta.
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Datum i vrijeme kada je entitet kreiran (UTC).
    /// </summary>
    public DateTime? CreatedAtUtc { get; set; }

    /// <summary>
    /// Datum i vrijeme kada je entitet zadnji put izmijenjen (UTC). (optional)
    /// </summary>
    public DateTime? ModifiedAtUtc { get; set; }
}
