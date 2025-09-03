namespace CZM1.API.Endpoints.KvizPitanjaEndpoints;

using CZM1.API.Data;
using global::CZM1.API.Helper.Api;
using global::CZM1.API.Models.Kalendar;
using global::CZM1.API.Services;
using CZM1.API.Models.Kviz;
using CZM1.API.Models.M04Kviz;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CZM1.API.Endpoints.KvizPitanjaEndpoints.KvizPitanjeUpdateOrInsertEndpoint;

[Route("kviz-pitanja")]
[MyAuthorization(isAdmin: true)]
public class KvizPitanjeUpdateOrInsertEndpoint(
    MyDbContext db,
    IMyFileService fileService,
    IMyAuthService authService,
    IMyImageHelper imageHelper,
    KvizPitanjeUpdateOrInsertValidator validator
    ) : MyEndpointBaseAsync
    .WithRequest<KvizPitanjeUpdateOrInsertRequest>
    .WithActionResult
{
    [HttpPost]
    [RequestSizeLimit(10_000_000)] // 10MB limit like in HistorijskiDogadjaj
    public override async Task<ActionResult> HandleAsync(
        [FromForm] KvizPitanjeUpdateOrInsertRequest request,
        CancellationToken cancellationToken = default)
    {
        var authInfo = authService.GetAuthInfoFromRequest();
        if (!authInfo.IsLoggedIn || !authInfo.IsAdmin)
            return Unauthorized("Unauthorized or insufficient privileges.");

        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));

        var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        bool isInsert = request.Id == null || request.Id == 0;
        PitanjeEntity? pitanje;

        if (isInsert)
        {
            pitanje = new PitanjeEntity
            {
                TekstPitanja = request.TekstPitanja,
                TipPitanja = request.TipPitanja,
                TezinaPitanja = request.TezinaPitanja,
                HistorijskiDogadjajId = request.HistorijskiDogadjajId,
                BrojBodova = request.BrojBodova,
                IsAktivan = request.IsAktivan,
                CreatedBy = authInfo.KorisnikId
            };
            db.Pitanja.Add(pitanje);
            await db.SaveChangesAsync(cancellationToken); // Save to get Id for images
        }
        else
        {
            pitanje = await db.Pitanja
                .Include(x => x.Odgovori)
                .Include(x => x.PitanjeSlike)
                .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (pitanje == null)
                return NotFound("Pitanje nije pronađeno.");

            pitanje.TekstPitanja = request.TekstPitanja;
            pitanje.HistorijskiDogadjajId = request.HistorijskiDogadjajId;
            pitanje.TipPitanja = request.TipPitanja;
            pitanje.TezinaPitanja = request.TezinaPitanja;
            pitanje.BrojBodova = request.BrojBodova;
            pitanje.IsAktivan = request.IsAktivan;
            pitanje.ModifiedBy = authInfo.KorisnikId;

            await db.SaveChangesAsync(cancellationToken);
        }

        // Handle answers
        if (!isInsert)
        {
            // Get IDs of current answers to determine which ones to delete
            var existingAnswerIds = pitanje.Odgovori.Select(o => o.Id).ToList();

            // Don't use Clear() as it breaks the relationships
            // Instead, explicitly remove each answer from the database
            foreach (var answer in pitanje.Odgovori.ToList())
            {
                db.KvizPitanjaPonudjeneOpcije.Remove(answer);
            }

            // Save changes to remove old answers before adding new ones
            await db.SaveChangesAsync(cancellationToken);

            // Refresh the entity to avoid tracking issues
            db.Entry(pitanje).Reload();
        }

        // Add the new answers
        foreach (var odgovor in request.Odgovori)
        {
            db.KvizPitanjaPonudjeneOpcije.Add(new PitanjaPonudjenaOpcijaEntity
            {
                PitanjeId = pitanje.Id,
                TekstOdgovora = odgovor.TekstOdgovora,
                Tacan = odgovor.Tacan
            });
        }

        // Handle images
        var slikeFolder = Path.Combine("pitanja", pitanje.Id.ToString());
        Directory.CreateDirectory(Path.Combine(wwwRootPath, slikeFolder));

        var slikeZaZadrzati = new List<PitanjeSlikaEntity>();

        if (request.Slike != null)
        {
            foreach (var slikaDto in request.Slike)
            {
                if (slikaDto.Id is not null)
                {
                    // Existing image
                    var postojecaSlika = pitanje.PitanjeSlike.FirstOrDefault(x => x.Id == slikaDto.Id);
                    if (postojecaSlika is not null)
                    {
                        slikeZaZadrzati.Add(postojecaSlika);
                    }
                }
                else if (slikaDto.File is not null && slikaDto.File.Length > 0)
                {
                    // New image
                    var resizedStream = await imageHelper.ResizeImageAsync(
                        slikaDto.File.OpenReadStream(), 600, 600
                    );

                    var savedPath = await fileService.SaveFileAsync(
                        new FormFile(resizedStream, 0, resizedStream.Length,
                            slikaDto.File.Name, slikaDto.File.FileName),
                        slikeFolder,
                        cancellationToken
                    );

                    var nova = new PitanjeSlikaEntity
                    {
                        SlikaPath = "/" + savedPath,
                        PitanjeId = pitanje.Id,
                        IzvorInfo = "Generated by system", // Provide appropriate value for IzvorInfo
                        IzvorUrl = savedPath, // Provide appropriate value for IzvorUrl
                        Redoslijed = 0 // Provide appropriate value for Redoslijed
                    };

                    slikeZaZadrzati.Add(nova);
                    db.Add(nova);
                }
            }
        }

        var slikeZaBrisanje = pitanje.PitanjeSlike
            .Where(x => slikeZaZadrzati.All(z => z.Id != x.Id))
            .ToList();

        foreach (var slika in slikeZaBrisanje)
        {
            fileService.DeleteFile(slika.SlikaPath);
        }

        db.RemoveRange(slikeZaBrisanje);
        await db.SaveChangesAsync(cancellationToken);

        return Ok();
    }

    public class KvizPitanjeUpdateOrInsertRequest
    {
        public int? Id { get; set; }
        public required string TekstPitanja { get; set; }
        public required int HistorijskiDogadjajId { get; set; }
        public required PitanjeTip TipPitanja { get; set; }
        public required PitanjeTezina TezinaPitanja { get; set; }
        public int BrojBodova { get; set; }
        public bool IsAktivan { get; set; }
        public List<KvizPitanjeUpdateOrInsertRequestOdgovor> Odgovori { get; set; } = new();
        public List<KvizPitanjeUpdateOrInsertRequestSlika> Slike { get; set; } = new();

    }
    public class KvizPitanjeUpdateOrInsertRequestOdgovor
    {
        public required string TekstOdgovora { get; set; }
        public bool Tacan { get; set; }
    }

    public class KvizPitanjeUpdateOrInsertRequestSlika
    {
        public int? Id { get; set; }
        public IFormFile? File { get; set; }
    }
}