using CZM1.API.Models.Kalendar;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Kalendar;

public class KategorijaEntityConfiguration : IEntityTypeConfiguration<KategorijaEntity>
{
    public void Configure(EntityTypeBuilder<KategorijaEntity> builder)
    {
    }
}
