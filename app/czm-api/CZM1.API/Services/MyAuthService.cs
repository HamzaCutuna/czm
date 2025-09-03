using CZM1.API.Data;
using CZM1.API.Models.Korisnici;

namespace CZM1.API.Services;

public class MyAuthService(MyDbContext applicationDbContext, IHttpContextAccessor httpContextAccessor) : IMyAuthService
{

    // Generisanje novog tokena za korisnika
    public async Task<AutentikacijaTokenEntity> GenerateSaveAuthToken(KorisnikEntity user, CancellationToken cancellationToken = default) => await MyAuthServiceHelper.GenerateSaveAuthToken(
            httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
            applicationDbContext,
            user,
            cancellationToken
            );

    // Uklanjanje tokena iz baze podataka
    public async Task<bool> RevokeAuthToken(string tokenValue, CancellationToken cancellationToken = default) => await MyAuthServiceHelper.RevokeAuthToken(applicationDbContext, tokenValue, cancellationToken);

    // Dohvatanje informacija o autentifikaciji korisnika
    public MyAuthInfo GetAuthInfoFromTokenString(string? authToken) => MyAuthServiceHelper.GetAuthInfoFromTokenString(applicationDbContext, authToken);

    // Dohvatanje informacija o autentifikaciji korisnika
    public MyAuthInfo GetAuthInfoFromRequest() => MyAuthServiceHelper.GetAuthInfoFromRequest(applicationDbContext, httpContextAccessor);

    public MyAuthInfo GetAuthInfoFromTokenModel(AutentikacijaTokenEntity? myAuthToken) => MyAuthServiceHelper.GetAuthInfoFromTokenModel(myAuthToken);
}

