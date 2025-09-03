using CZM1.API.Models.Korisnici;

namespace CZM1.API.Services
{
    public interface IMyAuthService
    {
        Task<AutentikacijaTokenEntity> GenerateSaveAuthToken(KorisnikEntity user, CancellationToken cancellationToken = default);
        Task<bool> RevokeAuthToken(string tokenValue, CancellationToken cancellationToken = default);
        MyAuthInfo GetAuthInfoFromTokenString(string? authToken);
        MyAuthInfo GetAuthInfoFromRequest();
        MyAuthInfo GetAuthInfoFromTokenModel(AutentikacijaTokenEntity? myAuthToken);
    }

}
