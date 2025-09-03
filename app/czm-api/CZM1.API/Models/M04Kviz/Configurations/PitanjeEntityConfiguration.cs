using CZM1.API.Models.M04Kviz;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CZM1.API.Configurations.M04Kviz;

public class PitanjeEntityConfiguration : IEntityTypeConfiguration<PitanjeEntity>
{
    public void Configure(EntityTypeBuilder<PitanjeEntity> builder)
    {
   
    }
}
