namespace CZM1.API.Endpoints.LookupsEndpoints;

using CZM1.API.Data;
using CZM1.API.Helper.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.LookupsEndpoints.RegijaLookupEndpoint;


[Route("regije")]
public class RegijaLookupEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<RegijaLookupResponse[]>
{
    [HttpGet("lookup")]
    public override async Task<RegijaLookupResponse[]> HandleAsync(CancellationToken cancellationToken = default)
    {
        var result = await db.Regija
            .OrderBy(r => r.Naziv)
            .Select(r => new RegijaLookupResponse
            {
                Id = r.Id,
                Naziv = r.Naziv
            })
            .ToArrayAsync(cancellationToken);

        return result;
    }

    public class RegijaLookupResponse
    {
        public required int Id { get; set; }
        public required string Naziv { get; set; }
    }
}
