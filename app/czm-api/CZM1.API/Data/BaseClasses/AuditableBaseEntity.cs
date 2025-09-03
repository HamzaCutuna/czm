using CZM1.API.Models.Korisnici;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Data.BaseClasses;

/// <summary>
/// Bazna klasa za entitete koji trebaju audit podatke (kreirao/izmijenio i vrijeme).
/// </summary>
public abstract class AuditableBaseEntity : BaseEntity
{
    /// <summary>
    /// ID korisnika koji je kreirao entitet (optional).
    /// </summary>
    [ForeignKey(nameof(CreatedByUser))]
    public int? CreatedBy { get; set; }
    public virtual KorisnikEntity? CreatedByUser { get; set; }

    /// <summary>
    /// ID korisnika koji je zadnji izmijenio entitet (optional).
    /// </summary>
    [ForeignKey(nameof(ModifiedByUser))]
    public int? ModifiedBy { get; set; }

    /// <summary>
    /// Korisnik koji je zadnji izmijenio entitet (optional).
    /// </summary>
    public virtual KorisnikEntity? ModifiedByUser { get; set; }
}
