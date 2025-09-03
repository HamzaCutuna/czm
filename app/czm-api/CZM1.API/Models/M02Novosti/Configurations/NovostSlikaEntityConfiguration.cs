using CZM1.API.Models.Novosti;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Novosti;

public class NovostSlikaEntityConfiguration : IEntityTypeConfiguration<NovostSlikaEntity>
{
    public void Configure(EntityTypeBuilder<NovostSlikaEntity> builder)
    {
        // konfiguracija će se dodati kasnije
    }
}
