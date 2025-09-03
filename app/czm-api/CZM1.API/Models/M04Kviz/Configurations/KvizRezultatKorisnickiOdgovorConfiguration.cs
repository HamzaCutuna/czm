using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Models.Kviz;

public class KvizRezultatKorisnickiOdgovorConfiguration : IEntityTypeConfiguration<KvizRezultatKorisnickiOdgovorEntity>
{
    public void Configure(EntityTypeBuilder<KvizRezultatKorisnickiOdgovorEntity> builder)
    {
        builder
            .HasIndex(x => new { x.RezultatId, x.PitanjeId })
            .IsUnique()
            .HasDatabaseName("UX_KorisnickiOdgovor_RezultatId_PitanjeId");
    }
}
