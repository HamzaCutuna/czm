using CZM1.API.Data.BaseClasses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kalendar;

/// <summary>
/// Predstavlja video povezanu sa određenim historijskim događajem.
/// </summary>
public partial class HistorijskiDogadjajVideoEntity : BaseVideoEntity
{
    /// <summary>
    /// ID događaja kojem slika pripada. (optional)
    /// </summary>
    [ForeignKey(nameof(HistorijskiDogadjajInfo))]
    public int HistorijskiDogadjajInfoId { get; set; }
    public HistorijskiDogadjajEntity HistorijskiDogadjajInfo { get; set; } = default!;

    /// <summary>
    /// Označava da li se slika prikazuje unutar historijskog događaja.
    /// </summary>
    public bool PrikaziUDogadjaju { get; set; }

    /// <summary>
    /// Označava da li se slika prikazuje unutar pitanja (kviza).
    /// </summary>
    public bool PrikaziUPitanju { get; set; }
}
