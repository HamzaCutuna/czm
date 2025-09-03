namespace CZM1.API.Endpoints.LookupsEndpoints;

using CZM1.API.Data;
using CZM1.API.Helper.Api;
using CZM1.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[Route("statistika")]
[MyAuthorization(isAdmin: true)]
public class StatistikaUnosaEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<StatistikaUnosaEndpoint.StatistikaUnosaResponse[]>
{
    [HttpGet("unosi")]
    public override async Task<StatistikaUnosaResponse[]> HandleAsync(CancellationToken cancellationToken = default)
    {
        var result = await db.Korisnici
            .Select(user => new StatistikaUnosaResponse
            {
                KorisnikId = user.Id,
                Email = user.NormalizedEmail,
                BrojUnosa = db.HistorijskiDogadjaji.Count(h => h.CreatedBy == user.Id),
                BrojPitanja = db.Pitanja.Count(p => p.CreatedBy == user.Id)
            })
            .OrderByDescending(x => x.BrojUnosa)
            .ToArrayAsync(cancellationToken);

        return result;
    }

    public class StatistikaUnosaResponse
    {
        public required int KorisnikId { get; set; }
        public required string Email { get; set; }
        public required int BrojUnosa { get; set; }
        public required int BrojPitanja { get; set; }
    }
}
