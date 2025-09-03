using CZM1.API.Data.BaseClasses;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CZM1.API.Models.Korisnici;

/// <summary>
/// Predstavlja korisnika sistema.
/// </summary>
public partial class KorisnikEntity : BaseEntity
{
    /// <summary>
    /// NotMapped: Email adresa korisnika.
    /// </summary>
    [NotMapped]
    public required string Email
    {
        get => NormalizedEmail;
        set => NormalizedEmail = value.ToLowerInvariant().Trim();
    }

    /// <summary>
    /// Email normalized adresa korisnika.
    /// </summary>
    [MaxLength(128)]
    public string NormalizedEmail { get; private set; } = null!;

    /// <summary>
    /// Kriptovana lozinka korisnika.
    /// </summary>
    [MaxLength(128)]
    public string PasswordHash { get; set; }

    /// <summary>
    /// Ime korisnika.
    /// </summary>
    [MaxLength(64)]
    public required string Ime { get; set; }

    /// <summary>
    /// Prezime korisnika.
    /// </summary>
    [MaxLength(64)]
    public required string Prezime { get; set; }

    /*
    Ako sistem nije zamišljen da podržava česte promjene rola i 
    ako se dodavanje novih rola svodi na manje promjene u kodu, 
    tada može biti dovoljno koristiti boolean polja kao što su IsAdmin, IsManager itd. 

    Ovaj pristup je jednostavan i efektivan u situacijama gdje su role stabilne i unaprijed definirane.

    Međutim, glavna prednost korištenja role entiteta dolazi do izražaja kada aplikacija potencijalno raste i 
    zahtjeva kompleksnije role i ovlaštenja. U scenarijima gdje se očekuje veći broj različitih rola ili kompleksniji 
    sistem ovlaštenja, dodavanje nove bool varijable može postati nepraktično i otežati održavanje.

    Dakle, za stabilne sisteme s manjim brojem fiksnih rola, boolean polja su sasvim razumno rješenje.
     */

    /// <summary>
    /// Označava da li je korisnik administrator.
    /// </summary>
    public bool IsAdmin { get; set; }

    /// <summary>
    /// Strani ključ ka instituciji. (optional)
    /// </summary>
    [ForeignKey(nameof(Institucija))]
    public int InstitucijaId { get; set; }
    public InstitucijaEntity Institucija { get; set; } = default!;

    // Number of failed login attempts
    public int FailedLoginAttempts { get; set; } = 0;

    // Timestamp for when the account might be locked (optional)
    public DateTime? LockoutUntil { get; set; }

    // Helper method for password hashing
    public void SetPassword(string password)
    {
        var hasher = new PasswordHasher<KorisnikEntity>();
        PasswordHash = hasher.HashPassword(this, password);
    }

    // Helper method for password verification
    public bool VerifyPassword(string password)
    {
        var hasher = new PasswordHasher<KorisnikEntity>();
        var result = hasher.VerifyHashedPassword(this, PasswordHash, password);
        if (result == PasswordVerificationResult.Success)
        {
            // Reset failed login attempts on successful login
            FailedLoginAttempts = 0;
            LockoutUntil = null; // Reset lockout if it was set
            return true;
        }
        else
        {
            // Increment failed login attempts on unsuccessful login
            FailedLoginAttempts++;
            return false;
        }
    }

    // Check if account is locked
    public bool IsLocked()
    {
        return LockoutUntil.HasValue && LockoutUntil.Value > DateTime.UtcNow;
    }

    // Lock account for a specific duration
    public void LockAccount(int minutes)
    {
        LockoutUntil = DateTime.UtcNow.AddMinutes(minutes);
    }
}
