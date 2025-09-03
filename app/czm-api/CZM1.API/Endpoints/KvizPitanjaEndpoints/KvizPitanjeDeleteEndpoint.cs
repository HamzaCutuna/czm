namespace CZM1.API.Endpoints.KvizPitanjaEndpoints;

using CZM1.API.Data;
using CZM1.API.Helper.Api;
using CZM1.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("kviz-pitanja")]
[MyAuthorization(isAdmin: true)]
public class KvizPitanjeDeleteEndpoint(MyDbContext db, IMyAuthService authService) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithoutResult
{
    [HttpDelete("{id}")]
    public override async Task HandleAsync(int id, CancellationToken cancellationToken = default)
    {
        // Authorization check
        var authInfo = authService.GetAuthInfoFromRequest();
        if (!authInfo.IsLoggedIn || !authInfo.IsAdmin)
            throw new UnauthorizedAccessException("Unauthorized or insufficient privileges.");

        var pitanje = await db.Pitanja  
            .Include(x => x.Odgovori)
            .Include(x => x.PitanjeSlike)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (pitanje == null)
            throw new KeyNotFoundException("Pitanje nije pronađeno");

        db.RemoveRange(pitanje.Odgovori);
        db.RemoveRange(pitanje.PitanjeSlike);
        db.Remove(pitanje);

        await db.SaveChangesAsync(cancellationToken);
    }
}