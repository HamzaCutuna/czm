using CZM1.API.Data.BaseClasses;
using System.ComponentModel.DataAnnotations;

namespace CZM1.API.Models.Korisnici;

/// <summary>
/// Predstavlja instituciju sa osnovnim podacima poput naziva, grada i adrese.
/// </summary>
public partial class InstitucijaEntity : BaseEntity
{
    /// <summary>
    /// Naziv institucije.
    /// </summary>
    [MaxLength(128)]
    public required string Naziv { get; set; }

    /// <summary>
    /// Grad u kojem se institucija nalazi.
    /// </summary>
    [MaxLength(128)]
    public required string Grad { get; set; }

    /// <summary>
    /// Adresa institucije.
    /// </summary>
    [MaxLength(128)]
    public required string Adresa { get; set; }
}
