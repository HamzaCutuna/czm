namespace CZM1.API.Endpoints.DataSeedEndpoints;

using Bogus;
using CZM1.API.Data;
using CZM1.API.Helper.Api;
using CZM1.API.Models.Kalendar;
using CZM1.API.Models.Korisnici;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

[Route("data-seed")]
public class DataSeedGenerateEndpoint(MyDbContext db)
    : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<string>
{
    [HttpPost]
    public override async Task<string> HandleAsync(CancellationToken cancellationToken = default)
    {
        if (!db.Korisnici.Any())
        {
            // 1. Kreiraj instituciju FIT Mostar
            var fit = new InstitucijaEntity
            {
                Naziv = "Fakultet informacijskih tehnologija - FIT",
                Grad = "Mostar",
                Adresa = "Ulica Matice hrvatske bb"
            };
            db.Add(fit);
            await db.SaveChangesAsync(cancellationToken); // generiši ID za FK

            // 2. Kreiraj admin korisnika
            var admins = new List<KorisnikEntity>
            {
                new KorisnikEntity { Ime = "Adil", Prezime = "Joldic", Email = "adil@edu.fit.ba", IsAdmin = true, InstitucijaId = fit.Id },
                new KorisnikEntity { Ime = "Adna", Prezime = "Ćusić", Email = "adna.cusic@edu.fit.ba", IsAdmin = true, InstitucijaId = fit.Id },
                new KorisnikEntity { Ime = "Edina", Prezime = "Čmanjčanin", Email = "edina@edu.fit.ba", IsAdmin = true, InstitucijaId = fit.Id },
                new KorisnikEntity { Ime = "Sanja", Prezime = "Kapetanović", Email = "sanja@edu.fit.ba", IsAdmin = true, InstitucijaId = fit.Id },
                new KorisnikEntity { Ime = "Iris", Prezime = "Memić", Email = "iris@edu.fit.ba", IsAdmin = true, InstitucijaId = fit.Id },
                new KorisnikEntity { Ime = "Elda", Prezime = "Sultić", Email = "elda@fit.ba", IsAdmin = true, InstitucijaId = fit.Id },
                new KorisnikEntity { Ime = "Berun", Prezime = "Agić", Email = "berun.agic@edu.fit.ba", IsAdmin = true, InstitucijaId = fit.Id },
                new KorisnikEntity { Ime = "Nina", Prezime = "Bijedić", Email = "nbijedic@edu.fit.ba", IsAdmin = true, InstitucijaId = fit.Id },
                new KorisnikEntity { Ime = "Dino", Prezime = "Burić", Email = "dino.buric@edu.fit.ba", IsAdmin = true, InstitucijaId = fit.Id }
            };

            foreach (var admin in admins)
            {
                admin.SetPassword("fit123"); // u produkciji koristi jače lozinke
                db.Korisnici.Add(admin);
            }

            await db.SaveChangesAsync(cancellationToken);
        }

        // 3. Dodaj osnovne kategorije historijskih događaja
        if (!await db.Kategorije.AnyAsync(cancellationToken))
        {
            var kategorije = new List<KategorijaEntity>
            {
                new() { Naziv = "Politika" },
                new() { Naziv = "Nauka" },
                new() { Naziv = "Tehnologija" },
                new() { Naziv = "Kultura" },
                new() { Naziv = "Religija" },
                new() { Naziv = "Ratovi i sukobi" },
                new() { Naziv = "Humanitarno" },
                new() { Naziv = "Region" },
                new() { Naziv = "Sport" }
            };

            db.Kategorije.AddRange(kategorije);
            await db.SaveChangesAsync(cancellationToken);
        }

        // 4. Regije
        if (!await db.Regija.AnyAsync(cancellationToken))
        {
            var regije = new List<RegijaEntity>
        {
            new() { Naziv = "BiH" },
            new() { Naziv = "Evropa" },
            new() { Naziv = "Svijet" },
        };

            db.Regija.AddRange(regije);
            await db.SaveChangesAsync(cancellationToken);
        }


        // 5. Historijski događaji
        if (!await db.HistorijskiDogadjaji.AnyAsync(cancellationToken))
        {
            var katPolitika = await db.Kategorije.FirstAsync(x => x.Naziv == "Politika", cancellationToken);
            var katNauka = await db.Kategorije.FirstAsync(x => x.Naziv == "Nauka", cancellationToken);
            var katHumanitarno = await db.Kategorije.FirstAsync(x => x.Naziv == "Humanitarno", cancellationToken);
            var regEvropa = await db.Regija.FirstAsync(x => x.Naziv == "Evropa", cancellationToken);

            var dogadjaji = new List<HistorijskiDogadjajEntity>
            {
                new()
                {
                    KategorijaId = katPolitika.Id,
                    RegijaId = regEvropa.Id,
                    Opis = "1945. godine osnovana je Arapska liga kao važan politički savez arapskih zemalja.",
                    GreskaUkalendaru = false,
                    Datum = new DateTime(1945, 3, 22),
                    DogadjajSlikas = new List<HistorijskiDogadjajSlikaEntity>
                    {
                        new() {
                            SlikaPath = "/dogadjaji/test/arab-league.png",
                            IzvorInfo = "Wikipedia",
                            IzvorUrl = "https://en.wikipedia.org/wiki/Arab_League",
                            Redoslijed = 0
                        }
                    },
                    Dokumentacijas = new List<HistorijskiDogadjajDokumentacijaEntity>
                    {
                        new ()
                        {
                            EksterniUrl = "www.cin.ba",
                            Opis = "Cin istraživanje"
                        },
                        new ()
                        {
                            EksterniUrl = "www.google.ba",
                            Opis = "google news"
                        }
                    }
                },
                new()
                {
                    KategorijaId = katNauka.Id,
                    RegijaId = regEvropa.Id,
                    Opis = "1917. Albert Einstein objavio novu teoriju gravitacije – opštu teoriju relativnosti.",
                    GreskaUkalendaru = false,
                    Datum = new DateTime(1917, 3, 22),
                    DogadjajSlikas = new List<HistorijskiDogadjajSlikaEntity>
                    {
                        new() {
                            SlikaPath = "/dogadjaji/test/einstein.png",
                            IzvorInfo = "Einstein Archives",
                            IzvorUrl = "",
                            Redoslijed = 0
                        }
                    },
                    Dokumentacijas = new List<HistorijskiDogadjajDokumentacijaEntity>
                    {
                        new ()
                        {
                            EksterniUrl = "www.cin.ba",
                            Opis = "Cin istraživanje"
                        },
                        new ()
                        {
                            EksterniUrl = "www.google.ba",
                            Opis = "google news"
                        }
                    }
                },
            };

            db.HistorijskiDogadjaji.AddRange(dogadjaji);
            await db.SaveChangesAsync(cancellationToken);
        }


        // Kreiraj faker za imena
        var faker = new Faker("en");

        return "Data generation completed successfully.";
    }
}
