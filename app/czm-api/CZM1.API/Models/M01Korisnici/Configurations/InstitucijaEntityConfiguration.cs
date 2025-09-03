using CZM1.API.Models.Korisnici;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Korisnici;

public class InstitucijaEntityConfiguration : IEntityTypeConfiguration<InstitucijaEntity>
{
    public void Configure(EntityTypeBuilder<InstitucijaEntity> builder)
    {
        // Dodaj konfiguraciju ako bude potrebe (indeksi, odnosi, seed podaci itd.)
    }
}
