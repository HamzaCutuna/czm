namespace CZM1.API.Endpoints.HistorijskiDogadjajEndpoints;
using global::CZM1.API.Data;
using global::CZM1.API.Helper.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.HistorijskiDogadjajEndpoints.HistorijskiDogadjajCountEndpoint;

[Route("historijski-dogadjaji")]
public class HistorijskiDogadjajCountEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<List<HistorijskiDogadjajCountResponse>>
{
    [HttpGet("count")]
    public override async Task<List<HistorijskiDogadjajCountResponse>> HandleAsync(
    CancellationToken cancellationToken = default)
    {
        var sviDogadjaji = await db.HistorijskiDogadjaji
            .ToListAsync(cancellationToken);

        // Grupisanje postojećih događaja po mjesecu
        var grupisano = sviDogadjaji
            .GroupBy(x => x.Datum.Month)
            .ToDictionary(g => g.Key, g => g.Count());

        // Kreiranje rezultata za svih 12 mjeseci
        var rezultati = Enumerable.Range(1, 12)
            .Select(mjesec => new HistorijskiDogadjajCountResponse
            {
                Mjesec = mjesec,
                Count = grupisano.ContainsKey(mjesec) ? grupisano[mjesec] : 0
            })
            .ToList();

        return rezultati;
    }

    public class HistorijskiDogadjajCountResponse
    {
        public int Mjesec { get; set; }
        public int Count { get; set; }
    }

}
