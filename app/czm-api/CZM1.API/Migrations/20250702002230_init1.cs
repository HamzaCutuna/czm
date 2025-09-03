using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CZM1.API.Migrations
{
    /// <inheritdoc />
    public partial class init1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Institucije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Grad = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Institucije", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kategorije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kategorije", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kvizovi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kvizovi", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Regija",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regija", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    IsAdmin = table.Column<bool>(type: "bit", nullable: false),
                    InstitucijaId = table.Column<int>(type: "int", nullable: false),
                    FailedLoginAttempts = table.Column<int>(type: "int", nullable: false),
                    LockoutUntil = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Korisnici_Institucije_InstitucijaId",
                        column: x => x.InstitucijaId,
                        principalTable: "Institucije",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "HistorijskiDogadjaji",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KategorijaId = table.Column<int>(type: "int", nullable: false),
                    RegijaId = table.Column<int>(type: "int", nullable: false),
                    Opis = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    GreskaUkalendaru = table.Column<bool>(type: "bit", nullable: false),
                    Datum = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorijskiDogadjaji", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistorijskiDogadjaji_Kategorije_KategorijaId",
                        column: x => x.KategorijaId,
                        principalTable: "Kategorije",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HistorijskiDogadjaji_Regija_RegijaId",
                        column: x => x.RegijaId,
                        principalTable: "Regija",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AutentikacijaTokeni",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Value = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    RecordedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    KorisnikId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutentikacijaTokeni", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AutentikacijaTokeni_Korisnici_KorisnikId",
                        column: x => x.KorisnikId,
                        principalTable: "Korisnici",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "KvizRezultati",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KorisnikId = table.Column<int>(type: "int", nullable: false),
                    KvizId = table.Column<int>(type: "int", nullable: false),
                    BrojTacnih = table.Column<int>(type: "int", nullable: false),
                    UkupnoPitanja = table.Column<int>(type: "int", nullable: false),
                    RezultatProcenat = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    DatumPocetka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DatumZavrsetka = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KvizRezultati", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KvizRezultati_Korisnici_KorisnikId",
                        column: x => x.KorisnikId,
                        principalTable: "Korisnici",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KvizRezultati_Kvizovi_KvizId",
                        column: x => x.KvizId,
                        principalTable: "Kvizovi",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Novosti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KorisnikId = table.Column<int>(type: "int", nullable: false),
                    Naslov = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Tekst = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    DatumNaObavijestiUtc = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Novosti", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Novosti_Korisnici_KorisnikId",
                        column: x => x.KorisnikId,
                        principalTable: "Korisnici",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "HistorijskiDogadjajDokumentacije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HistorijskiDogadjajInfoId = table.Column<int>(type: "int", nullable: false),
                    DokumentacijaUrl = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    DokumentacijaOpis = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    PrikaziUDogadjaju = table.Column<bool>(type: "bit", nullable: false),
                    PrikaziUPitanju = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorijskiDogadjajDokumentacije", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistorijskiDogadjajDokumentacije_HistorijskiDogadjaji_HistorijskiDogadjajInfoId",
                        column: x => x.HistorijskiDogadjajInfoId,
                        principalTable: "HistorijskiDogadjaji",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "HistorijskiDogadjajSlike",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HistorijskiDogadjajInfoId = table.Column<int>(type: "int", nullable: false),
                    PrikaziUDogadjaju = table.Column<bool>(type: "bit", nullable: false),
                    PrikaziUPitanju = table.Column<bool>(type: "bit", nullable: false),
                    SlikaPath = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    IzvorInfo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    IzvorUrl = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    Redoslijed = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorijskiDogadjajSlike", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistorijskiDogadjajSlike_HistorijskiDogadjaji_HistorijskiDogadjajInfoId",
                        column: x => x.HistorijskiDogadjajInfoId,
                        principalTable: "HistorijskiDogadjaji",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "HistorijskiDogadjajVideo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HistorijskiDogadjajInfoId = table.Column<int>(type: "int", nullable: false),
                    PrikaziUDogadjaju = table.Column<bool>(type: "bit", nullable: false),
                    PrikaziUPitanju = table.Column<bool>(type: "bit", nullable: false),
                    VideoUrl = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    IzvorInfo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    IzvorUrl = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    Redoslijed = table.Column<int>(type: "int", nullable: false),
                    VideoDuzinaSek = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorijskiDogadjajVideo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistorijskiDogadjajVideo_HistorijskiDogadjaji_HistorijskiDogadjajInfoId",
                        column: x => x.HistorijskiDogadjajInfoId,
                        principalTable: "HistorijskiDogadjaji",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Pitanja",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HistorijskiDogadjajId = table.Column<int>(type: "int", nullable: false),
                    TekstPitanja = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    BrojBodova = table.Column<int>(type: "int", nullable: false),
                    TipPitanja = table.Column<int>(type: "int", nullable: false),
                    TezinaPitanja = table.Column<int>(type: "int", nullable: false),
                    IsAktivan = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pitanja", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pitanja_HistorijskiDogadjaji_HistorijskiDogadjajId",
                        column: x => x.HistorijskiDogadjajId,
                        principalTable: "HistorijskiDogadjaji",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "NovostSlike",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NovostId = table.Column<int>(type: "int", nullable: false),
                    SlikaPath = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    IzvorInfo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    IzvorUrl = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    Redoslijed = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NovostSlike", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NovostSlike_Novosti_NovostId",
                        column: x => x.NovostId,
                        principalTable: "Novosti",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "KvizPitanja",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KvizId = table.Column<int>(type: "int", nullable: false),
                    PitanjeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KvizPitanja", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KvizPitanja_Kvizovi_KvizId",
                        column: x => x.KvizId,
                        principalTable: "Kvizovi",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KvizPitanja_Pitanja_PitanjeId",
                        column: x => x.PitanjeId,
                        principalTable: "Pitanja",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "KvizPitanjaPonudjeneOpcije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PitanjeId = table.Column<int>(type: "int", nullable: false),
                    TekstOdgovora = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Tacan = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KvizPitanjaPonudjeneOpcije", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KvizPitanjaPonudjeneOpcije_Pitanja_PitanjeId",
                        column: x => x.PitanjeId,
                        principalTable: "Pitanja",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "KvizRezultatiKorisnickiOdgovori",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PitanjeId = table.Column<int>(type: "int", nullable: false),
                    RezultatId = table.Column<int>(type: "int", nullable: false),
                    OdgovorId = table.Column<int>(type: "int", nullable: true),
                    Tacno = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KvizRezultatiKorisnickiOdgovori", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KvizRezultatiKorisnickiOdgovori_KvizPitanjaPonudjeneOpcije_OdgovorId",
                        column: x => x.OdgovorId,
                        principalTable: "KvizPitanjaPonudjeneOpcije",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KvizRezultatiKorisnickiOdgovori_KvizRezultati_RezultatId",
                        column: x => x.RezultatId,
                        principalTable: "KvizRezultati",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_KvizRezultatiKorisnickiOdgovori_Pitanja_PitanjeId",
                        column: x => x.PitanjeId,
                        principalTable: "Pitanja",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AutentikacijaTokeni_KorisnikId",
                table: "AutentikacijaTokeni",
                column: "KorisnikId");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajDokumentacije_HistorijskiDogadjajInfoId",
                table: "HistorijskiDogadjajDokumentacije",
                column: "HistorijskiDogadjajInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjaji_KategorijaId",
                table: "HistorijskiDogadjaji",
                column: "KategorijaId");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjaji_RegijaId",
                table: "HistorijskiDogadjaji",
                column: "RegijaId");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajSlike_HistorijskiDogadjajInfoId",
                table: "HistorijskiDogadjajSlike",
                column: "HistorijskiDogadjajInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajVideo_HistorijskiDogadjajInfoId",
                table: "HistorijskiDogadjajVideo",
                column: "HistorijskiDogadjajInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_Korisnici_InstitucijaId",
                table: "Korisnici",
                column: "InstitucijaId");

            migrationBuilder.CreateIndex(
                name: "IX_Korisnici_NormalizedEmail",
                table: "Korisnici",
                column: "NormalizedEmail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KvizPitanja_KvizId_PitanjeId",
                table: "KvizPitanja",
                columns: new[] { "KvizId", "PitanjeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KvizPitanja_PitanjeId",
                table: "KvizPitanja",
                column: "PitanjeId");

            migrationBuilder.CreateIndex(
                name: "IX_KvizPitanjaPonudjeneOpcije_PitanjeId_TekstOdgovora",
                table: "KvizPitanjaPonudjeneOpcije",
                columns: new[] { "PitanjeId", "TekstOdgovora" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KvizRezultati_KorisnikId",
                table: "KvizRezultati",
                column: "KorisnikId");

            migrationBuilder.CreateIndex(
                name: "IX_KvizRezultati_KvizId",
                table: "KvizRezultati",
                column: "KvizId");

            migrationBuilder.CreateIndex(
                name: "IX_KvizRezultatiKorisnickiOdgovori_OdgovorId",
                table: "KvizRezultatiKorisnickiOdgovori",
                column: "OdgovorId");

            migrationBuilder.CreateIndex(
                name: "IX_KvizRezultatiKorisnickiOdgovori_PitanjeId",
                table: "KvizRezultatiKorisnickiOdgovori",
                column: "PitanjeId");

            migrationBuilder.CreateIndex(
                name: "UX_KorisnickiOdgovor_RezultatId_PitanjeId",
                table: "KvizRezultatiKorisnickiOdgovori",
                columns: new[] { "RezultatId", "PitanjeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Novosti_DatumNaObavijestiUtc",
                table: "Novosti",
                column: "DatumNaObavijestiUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Novosti_KorisnikId",
                table: "Novosti",
                column: "KorisnikId");

            migrationBuilder.CreateIndex(
                name: "IX_NovostSlike_NovostId",
                table: "NovostSlike",
                column: "NovostId");

            migrationBuilder.CreateIndex(
                name: "IX_Pitanja_HistorijskiDogadjajId",
                table: "Pitanja",
                column: "HistorijskiDogadjajId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AutentikacijaTokeni");

            migrationBuilder.DropTable(
                name: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropTable(
                name: "HistorijskiDogadjajSlike");

            migrationBuilder.DropTable(
                name: "HistorijskiDogadjajVideo");

            migrationBuilder.DropTable(
                name: "KvizPitanja");

            migrationBuilder.DropTable(
                name: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropTable(
                name: "NovostSlike");

            migrationBuilder.DropTable(
                name: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropTable(
                name: "KvizRezultati");

            migrationBuilder.DropTable(
                name: "Novosti");

            migrationBuilder.DropTable(
                name: "Pitanja");

            migrationBuilder.DropTable(
                name: "Kvizovi");

            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropTable(
                name: "HistorijskiDogadjaji");

            migrationBuilder.DropTable(
                name: "Institucije");

            migrationBuilder.DropTable(
                name: "Kategorije");

            migrationBuilder.DropTable(
                name: "Regija");
        }
    }
}
