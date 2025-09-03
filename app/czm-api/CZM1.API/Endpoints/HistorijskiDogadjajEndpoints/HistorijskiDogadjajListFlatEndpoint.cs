using CZM1.API.Data;
using CZM1.API.Data.ShareDtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CZM1.API.Endpoints.HistorijskiDogadjajEndpoints;

[Route("historijski-dogadjaji")]
public class HistorijskiDogadjajFlatWithMediaEndpoint(MyDbContext db) : ControllerBase
{
    // GET historijski-dogadjaji/flat?from=1900-01-01&to=2026-01-01&regijaId=1&kategorijaId=3&q=bosna&take=0
    [HttpGet("flat")]
    public async Task<ActionResult<List<HistorijskiDogadjajFlatWithMediaDto>>> GetFlatAsync(
    [FromQuery] HistorijskiDogadjajFlatRequest request,
    CancellationToken ct = default)
    {
        var q = db.HistorijskiDogadjaji
            .AsNoTracking()
            .Include(x => x.Regija)
            .Include(x => x.Kategorija)
            .Include(x => x.CreatedByUser)
            .Include(x => x.DogadjajSlikas)
            .Include(x => x.Dokumentacijas)
            .OrderBy(x => x.Datum)
            .AsQueryable();

        if (request.From is not null) q = q.Where(d => d.Datum >= request.From.Value);
        if (request.To is not null) q = q.Where(d => d.Datum < request.To.Value);
        if (request.RegijaId is not null) q = q.Where(d => d.RegijaId == request.RegijaId);
        if (request.KategorijaId is not null) q = q.Where(d => d.KategorijaId == request.KategorijaId);

        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            var term = request.Q.Trim();
            q = q.Where(d => EF.Functions.Like(d.Opis, $"%{term}%"));
        }

        if (request.OnlyWithImage)
        {
            q = q.Where(x => x.DogadjajSlikas.Any());
        }

        if (request.Take is > 0) q = q.Take(request.Take.Value);

        // sad materijalizuj entitete u memoriju
        var entities = await q.ToListAsync(ct);

        // i tek ovdje pozovi Build
        var list = entities.Select(x => new HistorijskiDogadjajFlatWithMediaDto
        {
            Id = x.Id,
            Datum = x.Datum,
            Godina = x.Godina,
            Mjesec = x.Mjesec,
            Dan = x.Dan,
            Opis = x.Opis,
            RegijaId = x.RegijaId,
            Regija = x.Regija?.Naziv,
            KategorijaId = x.KategorijaId,
            Kategorija = x.Kategorija?.Naziv,
            CreatedByUser = x.CreatedByUser?.NormalizedEmail,
            Slike = x.DogadjajSlikas.OrderBy(s => s.Redoslijed).Select(SlikaShareDto.Build).ToList(),
            Dokumenti = x.Dokumentacijas.OrderBy(d => d.Id).Select(DokumentSharedDto.Build).ToList()
        }).ToList();

        return Ok(list);
    }

    public sealed class HistorijskiDogadjajFlatRequest
    {
        public DateTime? From { get; set; }          // npr. 1900-01-01
        public DateTime? To { get; set; }            // ekskluzivno: 2026-01-01
        public int? RegijaId { get; set; }
        public int? KategorijaId { get; set; }
        public string? Q { get; set; }
        public int? Take { get; set; } = 2000;              // 0 ili null = bez limita
        public bool OnlyWithImage { get; set; } = true;
    }

    public sealed class HistorijskiDogadjajFlatWithMediaDto
    {
        public required int Id { get; set; }
        public required DateTime Datum { get; set; }
        public required int Godina { get; set; }
        public required int Mjesec { get; set; }
        public required int Dan { get; set; }
        public required string Opis { get; set; }

        public required int RegijaId { get; set; }
        public string? Regija { get; set; }

        public required int KategorijaId { get; set; }
        public string? Kategorija { get; set; }

        public string? CreatedByUser { get; set; }

        public required List<SlikaShareDto> Slike { get; set; }
        public required List<DokumentSharedDto> Dokumenti { get; set; }
    }
}
