using CZM1.API.Models.Kviz;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Kviz;

public class KvizEntityConfiguration : IEntityTypeConfiguration<KvizEntity>
{
    public void Configure(EntityTypeBuilder<KvizEntity> builder)
    {
    }
}
