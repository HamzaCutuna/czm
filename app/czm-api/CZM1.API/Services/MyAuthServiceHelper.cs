using System;
using System.Text.Json.Serialization;
using CZM1.API.Data;
using CZM1.API.Helper;
using CZM1.API.Models.Korisnici;
using Microsoft.EntityFrameworkCore;

namespace CZM1.API.Services
{
    public class MyAuthServiceHelper
        //(ApplicationDbContext applicationDbContext, IHttpContextAccessor httpContextAccessor, MyTokenGenerator myTokenGenerator)
    {

        // Generisanje novog tokena za korisnika
        public static async Task<AutentikacijaTokenEntity> GenerateSaveAuthToken(string? IpAddress, MyDbContext applicationDbContext, KorisnikEntity user, CancellationToken cancellationToken = default)
        {
            string randomToken = MyTokenGenerator.Generate(10);

            var authToken = new AutentikacijaTokenEntity
            {
                IpAddress = IpAddress ?? string.Empty,
                Value = randomToken,
                Korisnik = user,
                RecordedAtUtc = DateTime.Now,
            };

            applicationDbContext.Add(authToken);
            await applicationDbContext.SaveChangesAsync(cancellationToken);

            return authToken;
        }

        // Uklanjanje tokena iz baze podataka
        public static async Task<bool> RevokeAuthToken(MyDbContext applicationDbContext, string tokenValue, CancellationToken cancellationToken = default)
        {
            var authToken = await applicationDbContext.AutentikacijaTokeni
                .FirstOrDefaultAsync(t => t.Value == tokenValue, cancellationToken);

            if (authToken == null)
                return false;

            applicationDbContext.Remove(authToken);
            await applicationDbContext.SaveChangesAsync(cancellationToken);

            return true;
        }

        // Dohvatanje informacija o autentifikaciji korisnika
        public static MyAuthInfo GetAuthInfoFromTokenString(MyDbContext applicationDbContext, string? authToken)
        {
            if (string.IsNullOrEmpty(authToken))
            {
                return GetAuthInfoFromTokenModel(null);
            }

            AutentikacijaTokenEntity? myAuthToken = applicationDbContext.AutentikacijaTokeni
                .IgnoreQueryFilters()
                .Include(x => x.Korisnik)
                .SingleOrDefault(x => x.Value == authToken);

            return GetAuthInfoFromTokenModel(myAuthToken);
        }


        // Dohvatanje informacija o autentifikaciji korisnika
        public static MyAuthInfo GetAuthInfoFromRequest(MyDbContext applicationDbContext, IHttpContextAccessor httpContextAccessor)
        {
            string? authToken = httpContextAccessor.HttpContext?.Request.Headers["my-auth-token"];
            return GetAuthInfoFromTokenString(applicationDbContext, authToken);
        }

        public static MyAuthInfo GetAuthInfoFromTokenModel(AutentikacijaTokenEntity? myAuthToken)
        {
            if (myAuthToken == null)
            {
                return new MyAuthInfo
                {
                    KorisnikId = 0,
                    Email = string.Empty,
                    Ime = string.Empty,
                    Prezime = string.Empty,
                    IsAdmin = false,
                    IsLoggedIn = false,
                    SlikaPath = string.Empty,
                };
            }

            return new MyAuthInfo
            {
                KorisnikId = myAuthToken.KorisnikId,
                Email = myAuthToken.Korisnik!.Email,
                Ime = myAuthToken.Korisnik.Ime,
                Prezime = myAuthToken.Korisnik.Prezime,
                IsAdmin = myAuthToken.Korisnik.IsAdmin,
                IsLoggedIn = true,
                SlikaPath = string.Empty,
            };
        }
    }

    // DTO to hold authentication information
    public class MyAuthInfo
    {
        public required int KorisnikId { get; set; }
        public required string Email { get; set; }
        public required string Ime { get; set; }
        public required string Prezime { get; set; }
        public required bool IsAdmin { get; set; }
        public required bool IsLoggedIn { get; set; }
        public required string SlikaPath {  get; set; }
    }
}
