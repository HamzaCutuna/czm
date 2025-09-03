namespace CZM1.API.Endpoints.KvizPitanjaEndpoints;

using CZM1.API.Data;
using CZM1.API.Helper.Api;
using CZM1.API.Models.M04Kviz; // Add this for PitanjeEntity
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

[Route("kviz-pitanja")]
public class KvizPitanjeStartEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithRequest<KvizPitanjeStartRequest>
    .WithResult<List<KvizPitanjeStartResponse>>
{
    [HttpGet("start")]
    public override async Task<List<KvizPitanjeStartResponse>> HandleAsync(
    [FromQuery] KvizPitanjeStartRequest request,
    CancellationToken cancellationToken = default)
    {
        int brojPitanja = Math.Min(100, request.BrojPitanja);

        var baseQuery = db.Pitanja
            .Include(x => x.HistorijskiDogadjaj)
                .ThenInclude(h => h.Kategorija)
            .Include(x => x.HistorijskiDogadjaj)
                .ThenInclude(h => h.Regija)
            .Include(x => x.HistorijskiDogadjaj)
                .ThenInclude(h => h.DogadjajSlikas)
            .Include(x => x.Odgovori)
            .Include(x => x.PitanjeSlike)
            .OrderBy(x => Guid.NewGuid()) //random order
            .Take(brojPitanja)
            .AsQueryable();


        if (request.RegijaIds != null && request.RegijaIds.Any())
        {
            baseQuery = baseQuery.Where(x => request.RegijaIds.Contains(x.HistorijskiDogadjaj.RegijaId));
        }

        var result = baseQuery.Select(p => new KvizPitanjeStartResponse
        {
            Id = p.Id,
            TekstPitanja = p.TekstPitanja,
            TipPitanja = p.TipPitanja.ToString(),
            TezinaPitanja = p.TezinaPitanja.ToString(),
            KategorijaNaziv = p.HistorijskiDogadjaj.Kategorija!.Naziv,
            Dogdajaj = new KvizPitanjeStartResponseDogadaj
            {
                Datum = p.HistorijskiDogadjaj.Datum,
                HistorijskiDogadjajId = p.HistorijskiDogadjaj.Id,
                OpisDogadjaja = p.HistorijskiDogadjaj.Opis,
                Slike = p.HistorijskiDogadjaj.DogadjajSlikas
                .OrderBy(s => s.Redoslijed)
                .Select(s => new KvizPitanjeStartResponseSlika
                {
                    Id = s.Id,
                    SlikaPath = s.SlikaPath,
                    IzvorInfo = s.IzvorInfo,
                    IzvorUrl = s.IzvorUrl,
                    Redoslijed = s.Redoslijed
                }).ToList(),
            },

            RegijaNaziv = p.HistorijskiDogadjaj.Regija!.Naziv,
            Odgovori = p.Odgovori.OrderBy(x => Guid.NewGuid()).Select(o => new KvizPitanjeStartResponseOdgovor()
            {
                Id = o.Id,
                TekstOdgovora = o.TekstOdgovora,
                Tacan = o.Tacan
            }).ToList(),
            PitanjaSlike = p.PitanjeSlike.Select(s => new KvizPitanjeStartResponseSlika()
            {
                Id = s.Id,
                SlikaPath = s.SlikaPath,
                IzvorInfo = s.IzvorInfo,
                IzvorUrl = s.IzvorUrl,
                Redoslijed = s.Redoslijed
            }).ToList()
        }).ToList();
        return result;
    }
}

public class KvizPitanjeStartRequest
{
    public List<int>? RegijaIds { get; set; } = [];
    public int BrojPitanja { get; set; }
}

public class KvizPitanjeStartResponse
{
    public required int Id { get; set; }
    public required string TekstPitanja { get; set; }
    public required string TipPitanja { get; set; }
    public required string TezinaPitanja { get; set; }
    public required string? KategorijaNaziv { get; set; }
    public required string? RegijaNaziv { get; set; }
    public required List<KvizPitanjeStartResponseOdgovor> Odgovori { get; set; }
    public required KvizPitanjeStartResponseDogadaj Dogdajaj { get; set; }
    public required List<KvizPitanjeStartResponseSlika> PitanjaSlike { get; set; }
}

public class KvizPitanjeStartResponseDogadaj
{
    public required int HistorijskiDogadjajId { get; set; }
    public required string OpisDogadjaja { get; set; }
    public required DateTime Datum {  get; set; }
    public required List<KvizPitanjeStartResponseSlika> Slike { get; set; }
}

public class KvizPitanjeStartResponseOdgovor
{
    public required int Id { get; set; }
    public required string TekstOdgovora { get; set; }
    public required bool Tacan { get; set; }
}

public class KvizPitanjeStartResponseSlika
{
    public required int Id { get; set; }
    public required string SlikaPath { get; set; }
    public required string? IzvorInfo { get; set; }
    public required string? IzvorUrl { get; set; }
    public required int Redoslijed { get; set; }
}