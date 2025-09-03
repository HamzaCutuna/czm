namespace CZM1.API.Endpoints.KvizPitanjaEndpoints;

using CZM1.API.Data;
using CZM1.API.Helper.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.KvizPitanjaEndpoints.KvizPitanjeCountEndpoint;

[Route("kviz-pitanja")]
public class KvizPitanjeCountEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<List<KvizPitanjeCountResponse>>
{
    [HttpGet("count")]
    public override async Task<List<KvizPitanjeCountResponse>> HandleAsync(
        CancellationToken cancellationToken = default)
    {
        // Grupisanje pitanja po HistorijskiDogadjajId
        var pitanja = await db.Pitanja.ToListAsync(cancellationToken);

        var grupisano = pitanja
            .GroupBy(x => x.HistorijskiDogadjajId)
            .ToDictionary(g => g.Key, g => g.Count());

        var rezultati = grupisano
            .Select(g => new KvizPitanjeCountResponse
            {
                HistorijskiDogadjajId = g.Key,
                Count = g.Value
            })
            .OrderBy(x => x.HistorijskiDogadjajId)
            .ToList();

        return rezultati;
    }

    public class KvizPitanjeCountResponse
    {
        public int HistorijskiDogadjajId { get; set; }
        public int Count { get; set; }
    }
}