using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.Korisnici;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kviz;

/// <summary>
/// Predstavlja rezultat korisnika za određeni kviz, uključujući tačnost i vrijeme rješavanja.
/// </summary>
public partial class KvizRezultatEntity : AuditableBaseEntity
{
    [ForeignKey(nameof(Korisnik))]
    public int KorisnikId { get; set; }
    public KorisnikEntity Korisnik { get; set; } = default!;

    /// <summary>
    /// ID kviza kojem rezultat pripada.
    /// </summary>
    [ForeignKey(nameof(Kviz))]
    public int KvizId { get; set; }
    public KvizEntity Kviz { get; set; } = default!;

    /// <summary>
    /// Broj tačnih odgovora.
    /// </summary>
    public int BrojTacnih { get; set; }

    /// <summary>
    /// Ukupan broj pitanja.
    /// </summary>
    public int UkupnoPitanja { get; set; }

    /// <summary>
    /// Postotak tačnosti (0–100). (optional)
    /// </summary>
    [Precision(5, 2)]
    public decimal RezultatProcenat { get; set; }

    /// <summary>
    /// Vrijeme početka kviza.
    /// </summary>
    public DateTime DatumPocetka { get; set; }

    /// <summary>
    /// Vrijeme završetka kviza. (optional)
    /// </summary>
    public DateTime? DatumZavrsetka { get; set; }

    /// <summary>
    /// Not mapped: Jel završen kviz.
    /// </summary>
    public bool JelZavrsenKviz => DatumZavrsetka.HasValue;

    /// <summary>
    /// Not mapped: Trajanje kviza ako je završen.
    /// </summary>
    public TimeSpan? Trajanje => (JelZavrsenKviz ? DatumZavrsetka - DatumPocetka : null);

    /// <summary>
    /// Kolekcija korisničkih odgovora.
    /// </summary>
    public virtual ICollection<KvizRezultatKorisnickiOdgovorEntity> KorisnickiOdgovori { get; set; } = [];
}
