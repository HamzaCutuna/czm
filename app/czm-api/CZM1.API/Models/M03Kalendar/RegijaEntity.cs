using CZM1.API.Data.BaseClasses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CZM1.API.Models.Kalendar;

public partial class RegijaEntity : AuditableBaseEntity
{
    /// <summary>
    /// Regije historijskog događaja, npr. BiH, Region, Svijet
    /// </summary>
    [MaxLength(100)]
    public required string Naziv { get; set; }

    public int? Order { get; set; }
}
