namespace CZM1.API.Endpoints.KvizPitanjaEndpoints;

using CZM1.API.Data;
using CZM1.API.Helper.Api;
using CZM1.API.Models.Kviz;
using CZM1.API.Models.Kalendar; // Add this for PitanjeSlikaEntity
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.KvizPitanjaEndpoints.KvizPitanjeFilterEndpoint;

[Route("kviz-pitanja")]
public class KvizPitanjeFilterEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithRequest<KvizPitanjeFilterRequest>
    .WithResult<List<KvizPitanjeFilterResponse>>
{
    [HttpGet("filter")]
    public override async Task<List<KvizPitanjeFilterResponse>> HandleAsync(
        [FromQuery] KvizPitanjeFilterRequest request,
        CancellationToken cancellationToken = default)
    {
        var query = db.Pitanja
            .Include(x => x.HistorijskiDogadjaj)
            .Include(x => x.Odgovori)
            .Include(x => x.PitanjeSlike)
            .AsQueryable();

        if (request.HistorijskiDogadjajId != null)
            query = query.Where(x => x.HistorijskiDogadjajId == request.HistorijskiDogadjajId);

        var pitanja = await query.ToListAsync(cancellationToken);

        return pitanja.Select(p => new KvizPitanjeFilterResponse
        {
            Id = p.Id,
            TekstPitanja = p.TekstPitanja,
            HistorijskiDogadjajId = p.HistorijskiDogadjajId,
            TipPitanja = p.TipPitanja.ToString(),
            TezinaPitanja = p.TezinaPitanja.ToString(),
            Odgovori = p.Odgovori.Select(o => new KvizPitanjeFilterResponseOdgovor
            {
                Id = o.Id,
                TekstOdgovora = o.TekstOdgovora,
                Tacan = o.Tacan
            }).ToList(),
            Slike = p.PitanjeSlike.Select(s => new KvizPitanjeFilterResponseSlika
            {
                Id = s.Id,
                SlikaPath = s.SlikaPath,
                IzvorInfo = s.IzvorInfo,
                IzvorUrl = s.IzvorUrl,
                Redoslijed = s.Redoslijed
            }).ToList()
        }).ToList();
    }

    public class KvizPitanjeFilterRequest
    {
        public int? HistorijskiDogadjajId { get; set; }
    }

    public class KvizPitanjeFilterResponse
    {
        public int Id { get; set; }
        public string TekstPitanja { get; set; }
        public int HistorijskiDogadjajId { get; set; }
        public string TipPitanja { get; set; }
        public string TezinaPitanja { get; set; }
        public List<KvizPitanjeFilterResponseOdgovor> Odgovori { get; set; }
        public List<KvizPitanjeFilterResponseSlika> Slike { get; set; }
    }

    public class KvizPitanjeFilterResponseOdgovor
    {
        public int Id { get; set; }
        public string TekstOdgovora { get; set; }
        public bool Tacan { get; set; }
    }

    public class KvizPitanjeFilterResponseSlika
    {
        public int Id { get; set; }
        public string SlikaPath { get; set; }
        public string? IzvorInfo { get; set; }
        public string? IzvorUrl { get; set; }
        public int Redoslijed { get; set; }
    }
}