using CZM1.API.Models.Novosti;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Novosti;

public class NovostEntityConfiguration : IEntityTypeConfiguration<NovostEntity>
{
    public void Configure(EntityTypeBuilder<NovostEntity> builder)
    {
        builder.HasIndex(x => x.DatumNaObavijestiUtc);
    }
}
