using CZM1.API.Models.Korisnici;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.Korisnici;

public class AutentikacijaTokenEntityConfiguration : IEntityTypeConfiguration<AutentikacijaTokenEntity>
{
    public void Configure(EntityTypeBuilder<AutentikacijaTokenEntity> builder)
    {
        // konfiguracija dolazi ovdje
    }
}
