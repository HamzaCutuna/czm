using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.Kalendar;
using CZM1.API.Models.Kviz;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.M04Kviz
{
    public enum PitanjeTip
    {
        Undefined = 0,
        SCSA = 1,
    }

    public enum PitanjeTezina
    {
        Undefined = 0,
        Lako = 1,
        Srednje = 2,
        Tesko = 3,
    }

    public class PitanjeEntity : AuditableBaseEntity
    {
        /// <summary>
        /// ID historijskog događaja (ako je pitanje povezano). (optional)
        /// </summary>
        [ForeignKey(nameof(HistorijskiDogadjaj))]
        public int HistorijskiDogadjajId { get; set; }
        public HistorijskiDogadjajEntity HistorijskiDogadjaj { get; set; } = default!;

        /// <summary>
        /// Tekst pitanja.
        /// </summary>
        [MaxLength(2048)]
        public required string TekstPitanja { get; set; }

        /// <summary>
        /// Broj bodova koje pitanje nosi.
        /// </summary>
        public int BrojBodova { get; set; }

        /// <summary>
        /// Tip pitanja (npr. višestruki izbor, tačno/netačno).
        /// </summary>
        public required PitanjeTip TipPitanja { get; set; }

        /// <summary>
        /// Težina pitanja (npr. lako, srednje, teško).
        /// </summary>
        public required PitanjeTezina TezinaPitanja { get; set; }

        /// <summary>
        /// Da li je pitanje aktivno.
        /// </summary>
        public bool IsAktivan { get; set; }

        /// <summary>
        /// Kolekcija odgovora vezanih za pitanje.
        /// </summary>
        public virtual ICollection<PitanjaPonudjenaOpcijaEntity> Odgovori { get; set; } = [];

        /// <summary>
        /// Kolekcija slika vezanih za pitanje.
        /// </summary>
        public virtual ICollection<PitanjeSlikaEntity> PitanjeSlike { get; set; } = new List<PitanjeSlikaEntity>();

    }
}
