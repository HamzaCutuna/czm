namespace CZM1.API.Endpoints.LookupsEndpoints;
using global::CZM1.API.Data;
using global::CZM1.API.Helper.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.LookupsEndpoints.KategorijaLookupEndpoint;


[Route("kategorije")]
public class KategorijaLookupEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<KategorijaLookupResponse[]>
{
    [HttpGet("lookup")]
    public override async Task<KategorijaLookupResponse[]> HandleAsync(CancellationToken cancellationToken = default)
    {
        var result = await db.Kategorije
            .OrderBy(k => k.Naziv)
            .Where(x=>!x.IsDeleted)
            .Select(k => new KategorijaLookupResponse
            {
                ID = k.Id,
                Naziv = k.Naziv
            })
            .ToArrayAsync(cancellationToken);

        return result;
    }

    public class KategorijaLookupResponse
    {
        public required int ID { get; set; }
        public required string Naziv { get; set; }
    }
}
