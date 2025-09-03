namespace CZM1.API.Endpoints.HistorijskiDogadjajEndpoints;

using CZM1.API.Data;
using CZM1.API.Helper.Api;
using CZM1.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

[MyAuthorization(isAdmin: true)]
[Route("historijski-dogadjaji")]
public class HistorijskiDogadjajDeleteEndpoint(MyDbContext db, IMyFileService fileService) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithoutResult
{
    [HttpDelete("{id}")]
    public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
    {
        var dogadjaj = await db.HistorijskiDogadjaji
                   .Include(x => x.DogadjajSlikas)
                   .Include(x => x.Dokumentacijas)
                   .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (dogadjaj == null)
            throw new KeyNotFoundException("Događaj nije pronađen");

        // Obrisi slike sa diska
        foreach (var slika in dogadjaj.DogadjajSlikas)
        {
            fileService.DeleteFile(slika.SlikaPath);
        }

        // Obrisati sve povezane entitete
        db.RemoveRange(dogadjaj.DogadjajSlikas);
        db.RemoveRange(dogadjaj.Dokumentacijas);
        db.Remove(dogadjaj);

        await db.SaveChangesAsync(cancellationToken);
    }
}
