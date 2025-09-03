using CZM1.API.Models.Kviz;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Kviz;

public class KvizPitanjaEntityConfiguration : IEntityTypeConfiguration<KvizPitanjaEntity>
{
    public void Configure(EntityTypeBuilder<KvizPitanjaEntity> builder)
    {
        builder.HasIndex(x => new { x.KvizId, x.PitanjeId })
               .IsUnique();
    }
}
