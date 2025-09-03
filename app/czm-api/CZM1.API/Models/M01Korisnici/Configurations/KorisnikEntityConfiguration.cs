using CZM1.API.Models.Korisnici;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Korisnici;

public class KorisnikEntityConfiguration : IEntityTypeConfiguration<KorisnikEntity>
{
    public void Configure(EntityTypeBuilder<KorisnikEntity> builder)
    {
        // Jedinstveni indeks na NormalizedEmail
        builder
            .HasIndex(x => x.NormalizedEmail)
            .IsUnique();
    }
}
