using CZM1.API.Data.BaseClasses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CZM1.API.Models.Kalendar;

public partial class KategorijaEntity : AuditableBaseEntity
{
    /// <summary>
    /// Kategorija historijskog događaja, npr. Politika, Nauka ...
    /// </summary>
    [MaxLength(100)]
    public required string Naziv { get; set; }

    public bool IsDeleted { get; set; }
}
