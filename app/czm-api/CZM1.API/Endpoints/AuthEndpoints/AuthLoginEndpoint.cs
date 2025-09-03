using CZM1.API.Data;
using CZM1.API.Helper.Api;
using CZM1.API.Models.Korisnici;
using CZM1.API.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using static CZM1.API.Endpoints.AuthEndpoints.AuthLoginEndpoint;

namespace CZM1.API.Endpoints.AuthEndpoints;

[Route("auth")]
public class AuthLoginEndpoint(MyDbContext db, IMyAuthService authService) : MyEndpointBaseAsync
    .WithRequest<AuthLoginRequest>
    .WithActionResult<AuthLoginResponse>
{
    [HttpPost("login")]
    public override async Task<ActionResult<AuthLoginResponse>> HandleAsync(AuthLoginRequest request, CancellationToken cancellationToken = default)
    {
        // Provjera da li korisnik postoji u bazi
        KorisnikEntity? loggedInUser = await db.Korisnici
            .FirstOrDefaultAsync(u => u.NormalizedEmail == request.Email.ToUpper(), cancellationToken);

        if (loggedInUser == null || !loggedInUser.VerifyPassword(request.Password))
        {
            // Sačuvaj promjene samo ako je korisnik postojao i ako su povećani neuspješni pokušaji
            if (loggedInUser != null)
            {
                await db.SaveChangesAsync(cancellationToken);
            }
            return Unauthorized(new { Message = "Incorrect username or password" });
        }

        // Generisanje novog autentifikacionog tokena
        AutentikacijaTokenEntity newAuthToken = await authService.GenerateSaveAuthToken(loggedInUser, cancellationToken);
        MyAuthInfo authInfo = authService.GetAuthInfoFromTokenModel(newAuthToken);

        return Ok(new AuthLoginResponse
        {
            Token = newAuthToken.Value,
            MyAuthInfo = authInfo
        });

    }

    public class AuthLoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class AuthLoginResponse
    {
        public required MyAuthInfo? MyAuthInfo { get; set; }
        public string Token { get; internal set; }
    }
    public class LoginRequestValidator : AbstractValidator<AuthLoginRequest>
    {
        public LoginRequestValidator()
        {
            // Validacija Email polja
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email je obavezan.");
            //.EmailAddress().WithMessage("Email adresa nije validna.");

            // Validacija Password polja
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Lozinka je obavezna.");
            //.MinimumLength(8).WithMessage("Lozinka mora imati najmanje 8 karaktera.")
            //.Matches(@"[A-Z]").WithMessage("Lozinka mora sadržavati barem jedno veliko slovo.")
            //.Matches(@"[a-z]").WithMessage("Lozinka mora sadržavati barem jedno malo slovo.")
            //.Matches(@"[0-9]").WithMessage("Lozinka mora sadržavati barem jedan broj.")
            //.Matches(@"[\!\@\#\$\%\^\&\*\(\)\_\+\-=\[\]\{\};:'"",<>\.\?\\\/]").WithMessage("Lozinka mora sadržavati barem jedan specijalni karakter.");
        }
    }

}
