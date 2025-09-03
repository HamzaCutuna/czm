using CZM1.API.Data.BaseClasses;
using CZM1.API.Models.Kalendar;

namespace CZM1.API.Data.ShareDtos;

public class DokumentSharedDto
{
    public required int Id { get; set; }
    public required string EksterniUrl { get; set; }
    public required string Opis { get; set; }

    public static DokumentSharedDto Build(HistorijskiDogadjajDokumentacijaEntity dokumentacijaEntity) => new DokumentSharedDto
    {
        Id = dokumentacijaEntity.Id,
        EksterniUrl = dokumentacijaEntity.EksterniUrl,
        Opis = dokumentacijaEntity.Opis,
    };
}
