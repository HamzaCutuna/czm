
using CZM1.API.Data.ShareDtos;
using CZM1.API.Models.Kalendar;
using global::CZM1.API.Data;
using global::CZM1.API.Helper.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.HistorijskiDogadjajEndpoints.HistorijskiDogadjajGetGroupedByDanEndpoint;
using static CZM1.API.Endpoints.HistorijskiDogadjajEndpoints.HistorijskiDogadjajGetGroupedByDanEndpoint.HistorijskiDogadjajGetAllResponseDogadaji;

namespace CZM1.API.Endpoints.HistorijskiDogadjajEndpoints;
[Route("historijski-dogadjaji")]
//[MyAuthorization(isAdmin: true)]
public class HistorijskiDogadjajGetGroupedByDanEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithRequest<HistorijskiDogadjajGetGroupedByDanRequest>
    .WithResult<List<HistorijskiDogadjajGetGroupedByDanResponse>>
{
    [HttpGet("grouped-by-dan")]
    public override async Task<List<HistorijskiDogadjajGetGroupedByDanResponse>> HandleAsync(
        [FromQuery] HistorijskiDogadjajGetGroupedByDanRequest request,
        CancellationToken cancellationToken = default)
    {
        var query = db.HistorijskiDogadjaji
            .Include(x => x.CreatedByUser)
            .Include(x => x.Regija)
            .Include(x => x.Kategorija)
            .Include(x => x.DogadjajSlikas)
            .AsQueryable();

        if (request.Mjesec != null)
        {
            var mjesec = request.Mjesec.Value;
            query = query.Where(x => x.Datum.Month == mjesec);
        }

        if (request.Dan != null)
        {
            var dan = request.Dan.Value;
            query = query.Where(x => x.Datum.Day == dan);
        }

        var sviDogadjaji = await query
            .OrderBy(x=>x.Datum)
            .ToListAsync(cancellationToken);

        var grupisani = sviDogadjaji
            .GroupBy(d => d.Dan) // sad je dozvoljeno
            .OrderBy(g => g.Key)
            .Select(g => new HistorijskiDogadjajGetGroupedByDanResponse
            {
                Dan = g.Key,
                Dogadjaji = sviDogadjaji.Select(FromEntity).Where(x=>x.Dan == g.Key).ToList()
            }).ToList();

        var rezultati = Enumerable.Range(1, 31)
        .Select(dan => new HistorijskiDogadjajGetGroupedByDanResponse
        {
            Dan = dan,
            Dogadjaji = grupisani.FirstOrDefault(x => x.Dan == dan)?.Dogadjaji ?? new()
        })
        .ToList();

        return rezultati;
    }


    public class HistorijskiDogadjajGetGroupedByDanResponse
    {
        public int Dan { get; set; }
        public List<HistorijskiDogadjajGetAllResponseDogadaji> Dogadjaji { get; set; } = [];
    }

    public class HistorijskiDogadjajGetGroupedByDanRequest
    {
        public int? Mjesec { get; set; } // 1–12
        public int? Dan { get; set; } //
    }

    public class HistorijskiDogadjajGetAllResponseDogadaji
    {
        public required int Id { get; set; }
        public DateTime? CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedAtUtc { get; set; }
        public string? CreatedByUser { get; set; }
        public string? ModifiedByUser { get; set; }
        public required DateTime Datum { get; set; }
        public required string Opis { get; set; }
        public required int Godina { get; set; }
        public required int Mjesec { get; set; }
        public required int Dan { get; set; }
        public required string Regija { get; set; }
        public required int RegijaId { get; set; }
        public required string Kategorija { get; set; }
        public required int KategorijaId { get; set; }
        public required List<SlikaShareDto> Slike { get; set; }
        public required List<DokumentSharedDto> Dokumenti { get; set; }


        public static HistorijskiDogadjajGetAllResponseDogadaji FromEntity(HistorijskiDogadjajEntity x)
        {
            return new HistorijskiDogadjajGetAllResponseDogadaji
            {
                Id = x.Id,
                Datum = x.Datum,
                Opis = x.Opis,
                Mjesec = x.Mjesec,
                Godina = x.Godina,
                Dan = x.Dan,
                Regija = x.Regija.Naziv,
                RegijaId = x.RegijaId,
                Kategorija = x.Kategorija.Naziv,
                KategorijaId = x.KategorijaId,
                CreatedByUser = x.CreatedByUser != null ? x.CreatedByUser.NormalizedEmail : "",
                Slike = x.DogadjajSlikas.Select(SlikaShareDto.Build).ToList(),
                Dokumenti = x.Dokumentacijas.Select(DokumentSharedDto.Build).ToList()
            };
        }
    }
}
