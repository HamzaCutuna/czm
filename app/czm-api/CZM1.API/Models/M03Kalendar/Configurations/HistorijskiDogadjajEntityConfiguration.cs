using CZM1.API.Models.Kalendar;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Kalendar;

public class HistorijskiDogadjajEntityConfiguration : IEntityTypeConfiguration<HistorijskiDogadjajEntity>
{
    public void Configure(EntityTypeBuilder<HistorijskiDogadjajEntity> builder)
    {
        // konfiguracija će se dodati kasnije
    }
}
