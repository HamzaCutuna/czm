using CZM1.API.Data.BaseClasses;

namespace CZM1.API.Data.ShareDtos;
public class SlikaShareDto
{
    public required string SlikaPath { get; set; }
    public required int Redoslijed { get; set; }
    public required int Id { get; set; }

    public static SlikaShareDto Build(BaseSlikaEntity baseSlikaEntity) => new SlikaShareDto
    {
        Id = baseSlikaEntity.Id,
        SlikaPath = baseSlikaEntity.SlikaPath,
        Redoslijed = baseSlikaEntity.Redoslijed,
    };
}