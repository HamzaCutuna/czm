using CZM1.API.Models.Kviz;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Infrastructure.Configurations.Kviz;

public class KvizPitanjaPonudjenaOpcijaConfiguration : IEntityTypeConfiguration<PitanjaPonudjenaOpcijaEntity>
{
    public void Configure(EntityTypeBuilder<PitanjaPonudjenaOpcijaEntity> builder)
    {
        builder
            .HasIndex(x => new { x.PitanjeId, x.TekstOdgovora })
            .IsUnique();
    }
}
