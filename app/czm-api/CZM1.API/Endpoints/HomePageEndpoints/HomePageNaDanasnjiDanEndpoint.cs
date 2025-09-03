
using CZM1.API.Data.ShareDtos;
using CZM1.API.Models.Kalendar;
using global::CZM1.API.Data;
using global::CZM1.API.Helper.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.HistorijskiDogadjajEndpoints.HomePageNaDanasnjiDanEndpoint;

namespace CZM1.API.Endpoints.HistorijskiDogadjajEndpoints;
[Route("home-page")]
//[MyAuthorization(isAdmin: true)]
public class HomePageNaDanasnjiDanEndpoint(MyDbContext db) : MyEndpointBaseAsync
    .WithRequest<DanDto>
    .WithResult<NaDanasnjiDanResponse>
{
    [HttpGet("na-danasnji-dan")]
    public override async Task<NaDanasnjiDanResponse> HandleAsync([FromQuery]DanDto request,
        CancellationToken cancellationToken = default)
    {
        DateTime currentDate;
        try
        {
            currentDate = request.Dan.HasValue && request.Mjesec.HasValue
                ? new DateTime(2000, request.Mjesec.Value, request.Dan.Value)
                : DateTime.Now.Date;
        }
        catch
        {
            currentDate = DateTime.Now.Date;
        }


        DateTime dogadajiDate = currentDate;

        List<HistorijskiDogadjajEntity> sviDogadjaji = [];

        for (int i = 0; i < 366; i++) // maksimalno 366 pokušaja (prestupna godina)
        {
            var datum = dogadajiDate.AddDays(i);

            sviDogadjaji = await db.HistorijskiDogadjaji
                .Where(x => x.Datum.Day == datum.Day && x.Datum.Month == datum.Month)
                .Include(x => x.CreatedByUser)
                .Include(x => x.Regija)
                .Include(x => x.Kategorija)
                .Include(x => x.DogadjajSlikas)
                .Include(x => x.Dokumentacijas)
                .OrderByDescending(x => Guid.NewGuid())
                .ToListAsync(cancellationToken);

            if (sviDogadjaji.Any(x=>x.DogadjajSlikas.Count() > 0))
            {
                dogadajiDate = datum; // ažuriraj na pronađeni datum
                break;
            }
        }

        var prethodniDate = currentDate.AddDays(-1);
        var naredniDate = currentDate.AddDays(1);

        var rezultat = new NaDanasnjiDanResponse()
        {
            DogadajiDate = new (dogadajiDate),
            CurrentDate = new (currentDate),
            NextDate = new(naredniDate),
            PreviousDate = new(prethodniDate),
            DanasIstaknuto = sviDogadjaji
                    .Where(x=>x.DogadjajSlikas.Count() > 0)
                    .OrderBy(x=> Guid.NewGuid())
                    .Select(NaDanasnjiDanResponseDogadaj.FromEntity)
                    .ToList(),
            Regije = sviDogadjaji
                    .GroupBy(x => new { x.Regija.Order, x.Regija.Naziv }) // grupišemo po ID i nazivu
                    .OrderBy(grupa => grupa.Key.Order)                    // sortiramo po ID regije
                    .Select(grupa => new NaDanasnjiDanResponseRegija
                    {
                        NazivRegije = grupa.Key.Naziv,
                        Dogadaji = [.. grupa.Select(NaDanasnjiDanResponseDogadaj.FromEntity).ToList().OrderBy(x=>x.Godina).ThenBy(x=>x.Mjesec).ThenBy(x=>x.Dan)]
                    })
                    .ToList()
        };

        return rezultat;
    }

    public class DanDto
    {
        public int? Dan { get; set; }
        public int? Mjesec { get; set; }
        public string? MjesecOpis { get; }

        public DanDto()
        {

        }
        public DanDto(DateTime dateTime) {
            this.Dan = dateTime.Day;
            this.Mjesec = dateTime.Month;
            this.MjesecOpis = dateTime.ToString("MMMM");
        }
    }

    public class NaDanasnjiDanResponse
    {
        public DanDto NextDate {  get; set; }
        public DanDto CurrentDate { get; set; }
        public DanDto PreviousDate { get; set; }
        public DanDto DogadajiDate { get; internal set; }
        public List<NaDanasnjiDanResponseDogadaj> DanasIstaknuto { get; set; } = [];
        public List<NaDanasnjiDanResponseRegija> Regije { get; set; } = [];
    }

    public class NaDanasnjiDanResponseRegija
    {
        public required string NazivRegije { get; set; }
        public required List<NaDanasnjiDanResponseDogadaj> Dogadaji { get; set; }
    }

    public class NaDanasnjiDanResponseDogadaj
    {
        public required int Id { get; set; }
        public required string Opis { get; set; }
        public required int Godina { get; set; }
        public string Mjesec { get; set; }
        public required int Dan { get; set; }
        public required string Regija { get; set; }
        public required string Kategorija { get; set; }
        public required SlikaShareDto? Slike { get; set; }
        public required List<DokumentSharedDto> Dokumenti { get; set; }
        public static NaDanasnjiDanResponseDogadaj FromEntity(HistorijskiDogadjajEntity x)
        {
            return new NaDanasnjiDanResponseDogadaj
            {
                Id = x.Id,
                Opis = x.Opis.RemoveEscapeChar(),
                Godina = x.Godina,
                Dan = x.Dan,
                Regija = x.Regija.Naziv,
                Kategorija = x.Kategorija.Naziv,
                Slike = x.DogadjajSlikas.Select(SlikaShareDto.Build).FirstOrDefault(),
                Dokumenti = x.Dokumentacijas.Select(DokumentSharedDto.Build).ToList()
            };
        }
    }
}
public static class StringExtenders
{
    public static string RemoveEscapeChar(this string value) => new string(value.Where(c => !char.IsControl(c)).ToArray());
}
