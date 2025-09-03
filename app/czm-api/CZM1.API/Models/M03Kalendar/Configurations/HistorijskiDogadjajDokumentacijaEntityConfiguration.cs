using CZM1.API.Models.Kalendar;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Kalendar;

public class HistorijskiDogadjajDokumentacijaEntityConfiguration : IEntityTypeConfiguration<HistorijskiDogadjajDokumentacijaEntity>
{
    public void Configure(EntityTypeBuilder<HistorijskiDogadjajDokumentacijaEntity> builder)
    {
        // konfiguracija će se dodati po potrebi
    }
}
