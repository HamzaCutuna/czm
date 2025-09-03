using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.Kviz;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Kalendar;

/// <summary>
/// Predstavlja historijski događaj sa pripadajućim informacijama, kategorijom i regijom.
/// </summary>
public partial class HistorijskiDogadjajEntity : AuditableBaseEntity
{
    /// <summary>
    /// ID kategorije kojoj događaj pripada.
    /// </summary>
    [ForeignKey(nameof(Kategorija))]
    public int KategorijaId { get; set; }
    public KategorijaEntity Kategorija { get; set; } = default!;

    /// <summary>
    /// ID regije kojoj događaj pripada.
    /// </summary>
    [ForeignKey(nameof(Regija))]
    public int RegijaId { get; set; }
    public RegijaEntity Regija { get; set; } = default!;

    /// <summary>
    /// Opis događaja.
    /// </summary>
    [MaxLength(4000)]
    public string Opis { get; set; }

    /// <summary>
    /// Da li je u kalendaru zabilježena greška za ovaj događaj.
    /// </summary>
    public bool GreskaUkalendaru { get; set; }

    /// <summary>
    /// Datum događaja.
    /// </summary>
    public DateTime Datum { get; set; }

    /// <summary>
    /// Kolekcija slika vezanih za događaj.
    /// </summary>
    public virtual ICollection<HistorijskiDogadjajSlikaEntity> DogadjajSlikas { get; set; } = new List<HistorijskiDogadjajSlikaEntity>();

    /// <summary>
    /// Kolekcija video zapisa vezanih za događaj.
    /// </summary>
    public virtual ICollection<HistorijskiDogadjajVideoEntity> DogadjajVideos { get; set; } = new List<HistorijskiDogadjajVideoEntity>();

    /// <summary>
    /// Kolekcija dokumenata vezanih za događaj.
    /// </summary>
    public virtual ICollection<HistorijskiDogadjajDokumentacijaEntity> Dokumentacijas { get; set; } = new List<HistorijskiDogadjajDokumentacijaEntity>();

    /// <summary>
    /// Dan iz datuma događaja.
    /// </summary>
    public int Dan => Datum.Day;

    /// <summary>
    /// Mjesec iz datuma događaja.
    /// </summary>
    public int Mjesec => Datum.Month;

    /// <summary>
    /// Godina iz datuma događaja.
    /// </summary>
    public int Godina => Datum.Year;
}
