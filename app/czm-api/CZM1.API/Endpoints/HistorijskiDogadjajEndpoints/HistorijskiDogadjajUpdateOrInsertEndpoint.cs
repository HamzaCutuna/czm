namespace CZM1.API.Endpoints.HistorijskiDogadjajEndpoints;

using CZM1.API.Data;
using global::CZM1.API.Helper.Api;
using global::CZM1.API.Models.Kalendar;
using global::CZM1.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.HistorijskiDogadjajEndpoints.HistorijskiDogadjajGetGroupedByDanEndpoint;
using static CZM1.API.Endpoints.HistorijskiDogadjajEndpoints.HistorijskiDogadjajUpdateOrInsertEndpoint;

[Route("historijski-dogadjaji")]
[MyAuthorization(isAdmin: true)]
public class HistorijskiDogadjajUpdateOrInsertEndpoint(
    MyDbContext db, 
    IMyFileService fileService,
    IMyAuthService authService,
    IMyImageHelper imageHelper
    ) : MyEndpointBaseAsync
    .WithRequest<HistorijskiDogadjajUpdateOrInsertRequest>
    .WithActionResult<HistorijskiDogadjajGetAllResponseDogadaji>
{
    [HttpPost]
    [RequestSizeLimit(10_000_000)] // do 10MB
    public override async Task<ActionResult<HistorijskiDogadjajGetAllResponseDogadaji>> HandleAsync(
     [FromForm] HistorijskiDogadjajUpdateOrInsertRequest request,
     CancellationToken cancellationToken = default)
    {
        var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    
        bool isInsert = request.Id == null || request.Id == 0;
        HistorijskiDogadjajEntity? dogadjaj;

        if (isInsert)
        {
            dogadjaj = new HistorijskiDogadjajEntity();
            db.Add(dogadjaj);
        }
        else
        {
            dogadjaj = await db.HistorijskiDogadjaji
                  .Include(x => x.Regija)
                .Include(x => x.DogadjajSlikas)
                .Include(x => x.Dokumentacijas)
                .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (dogadjaj == null)
                return NotFound("Događaj nije pronađen.");
        }

        dogadjaj.KategorijaId = request.KategorijaId;
        dogadjaj.RegijaId = request.RegijaId;
        dogadjaj.Opis = request.Opis;
        dogadjaj.GreskaUkalendaru = request.GreskaUkalendaru;
        dogadjaj.Datum = new DateTime( request.Godina, request.Mjesec, request.Dan);

        if (authService.GetAuthInfoFromRequest().IsLoggedIn)
        {
            var currentUser = await db.Korisnici.FindAsync(authService.GetAuthInfoFromRequest()?.KorisnikId!);
            dogadjaj.CreatedByUser = currentUser;
        }

        await db.SaveChangesAsync(cancellationToken);

        var slikeFolder = Path.Combine("dogadjaji", dogadjaj.Mjesec.ToString(), dogadjaj.Dan.ToString(), dogadjaj.Godina.ToString(), dogadjaj.Id.ToString());
        Directory.CreateDirectory(Path.Combine(wwwRootPath, slikeFolder));

        var slikeZaZadrzati = new List<HistorijskiDogadjajSlikaEntity>();

        foreach (var slikaDto in request.Slike)
        {
            if (slikaDto.Id is not null)
            {
                // Postojeća slika – nađi u bazi
                var postojecaSlika = dogadjaj.DogadjajSlikas.FirstOrDefault(x => x.Id == slikaDto.Id);
                if (postojecaSlika is not null)
                {
                    postojecaSlika.Redoslijed = slikaDto.Redoslijed;
                    
                    slikeZaZadrzati.Add(postojecaSlika);
                }
            }
            else if (slikaDto.File is not null && slikaDto.File.Length > 0)
            {
                var resizedStream = await imageHelper.ResizeImageAsync(slikaDto.File.OpenReadStream(), 600, 600); // max 1200x1200

                var savedPath = await fileService.SaveFileAsync(
                    new FormFile(resizedStream, 0, resizedStream.Length, slikaDto.File.Name, slikaDto.File.FileName),
                    slikeFolder,
                    cancellationToken
                );

                var nova = new HistorijskiDogadjajSlikaEntity
                {
                    SlikaPath = "/" + savedPath,
                    Redoslijed = slikaDto.Redoslijed,
                    IzvorInfo = string.Empty,
                    IzvorUrl = string.Empty,
                    HistorijskiDogadjajInfoId = dogadjaj.Id
                };

                slikeZaZadrzati.Add(nova);
                db.Add(nova);
            }
        }
        await db.SaveChangesAsync(cancellationToken);

        // Obriši slike koje nisu više prisutne u requestu
        var slikeZaBrisanje = dogadjaj.DogadjajSlikas
            .Where(x => slikeZaZadrzati.All(z => z.Id != x.Id))
            .ToList();

        foreach (var slika in slikeZaBrisanje)
        {
            fileService.DeleteFile(slika.SlikaPath); // obriši fajl sa diska
        }

        db.RemoveRange(slikeZaBrisanje);

        await db.SaveChangesAsync(cancellationToken);

        // dokumenti
        foreach (var dokument in request.Dokumenti)
        {
            dogadjaj.Dokumentacijas.Add(new HistorijskiDogadjajDokumentacijaEntity
            {
                EksterniUrl = dokument.EksterniFileUrl,
                Opis = dokument.Opis,
            });
        }

        await db.SaveChangesAsync(cancellationToken);

        HistorijskiDogadjajEntity resultEntity = await db.HistorijskiDogadjaji.Where(x => x.Id == dogadjaj.Id)
            .Include(x => x.CreatedByUser)
             .Include(x => x.Regija)
            .Include(x => x.Kategorija)
            .Include(x => x.DogadjajSlikas)
            .Include(x => x.Dokumentacijas)
            .SingleAsync(cancellationToken);

        HistorijskiDogadjajGetAllResponseDogadaji resultDto = HistorijskiDogadjajGetAllResponseDogadaji.FromEntity(resultEntity);

        return Ok(resultDto);
    }

    public class HistorijskiDogadjajUpdateOrInsertRequest
    {
        public int? Id { get; set; }
        public required int KategorijaId { get; set; }
        public required int RegijaId { get; set; }
        public required string Opis { get; set; }
        public bool GreskaUkalendaru { get; set; }
        public int Godina { get; set; }
        public int Mjesec { get; set; }
        public int Dan { get; set; }
        public List<SlikaUploadDto> Slike { get; set; } = new();
        public List<DokumentUploadDto> Dokumenti { get; set; } = new();

        public class SlikaUploadDto
        {
            public int? Id { get; set; } // Dodano
            public IFormFile? File { get; set; } // Nullable jer može biti prazan za već postojeće (update)
            public int Redoslijed { get; set; }
        }

        public class DokumentUploadDto
        {
            public int? Id { get; set; } // Dodano
            public required string EksterniFileUrl { get; set; }
            public required string Opis { get; set; }
            public int Redoslijed { get; set; }
        }
    }

}
