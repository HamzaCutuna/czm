using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CZM1.API.Migrations
{
    /// <inheritdoc />
    public partial class auditopcije : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Regija",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Regija",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "Regija",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "Regija",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Pitanja",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Pitanja",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "Pitanja",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "Pitanja",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "NovostSlike",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "NovostSlike",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "NovostSlike",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "NovostSlike",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Novosti",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Novosti",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "Novosti",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "Novosti",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "KvizRezultatiKorisnickiOdgovori",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "KvizRezultatiKorisnickiOdgovori",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "KvizRezultatiKorisnickiOdgovori",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "KvizRezultatiKorisnickiOdgovori",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "KvizRezultati",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "KvizRezultati",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "KvizRezultati",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "KvizRezultati",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "KvizPitanjaPonudjeneOpcije",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "KvizPitanjaPonudjeneOpcije",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "KvizPitanjaPonudjeneOpcije",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "KvizPitanjaPonudjeneOpcije",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "KvizPitanja",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "KvizPitanja",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "KvizPitanja",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "KvizPitanja",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Kvizovi",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Kvizovi",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "Kvizovi",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "Kvizovi",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Korisnici",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "Korisnici",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Kategorije",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Kategorije",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "Kategorije",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "Kategorije",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "Institucije",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "Institucije",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "HistorijskiDogadjajVideo",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "HistorijskiDogadjajVideo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "HistorijskiDogadjajVideo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "HistorijskiDogadjajVideo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "HistorijskiDogadjajSlike",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "HistorijskiDogadjajSlike",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "HistorijskiDogadjajSlike",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "HistorijskiDogadjajSlike",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "HistorijskiDogadjaji",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "HistorijskiDogadjaji",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "HistorijskiDogadjaji",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "HistorijskiDogadjaji",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "HistorijskiDogadjajDokumentacije",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "HistorijskiDogadjajDokumentacije",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "HistorijskiDogadjajDokumentacije",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "HistorijskiDogadjajDokumentacije",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "AutentikacijaTokeni",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAtUtc",
                table: "AutentikacijaTokeni",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Regija_CreatedBy",
                table: "Regija",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Regija_ModifiedBy",
                table: "Regija",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Pitanja_CreatedBy",
                table: "Pitanja",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Pitanja_ModifiedBy",
                table: "Pitanja",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_NovostSlike_CreatedBy",
                table: "NovostSlike",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_NovostSlike_ModifiedBy",
                table: "NovostSlike",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Novosti_CreatedBy",
                table: "Novosti",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Novosti_ModifiedBy",
                table: "Novosti",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_KvizRezultatiKorisnickiOdgovori_CreatedBy",
                table: "KvizRezultatiKorisnickiOdgovori",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_KvizRezultatiKorisnickiOdgovori_ModifiedBy",
                table: "KvizRezultatiKorisnickiOdgovori",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_KvizRezultati_CreatedBy",
                table: "KvizRezultati",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_KvizRezultati_ModifiedBy",
                table: "KvizRezultati",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_KvizPitanjaPonudjeneOpcije_CreatedBy",
                table: "KvizPitanjaPonudjeneOpcije",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_KvizPitanjaPonudjeneOpcije_ModifiedBy",
                table: "KvizPitanjaPonudjeneOpcije",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_KvizPitanja_CreatedBy",
                table: "KvizPitanja",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_KvizPitanja_ModifiedBy",
                table: "KvizPitanja",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Kvizovi_CreatedBy",
                table: "Kvizovi",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Kvizovi_ModifiedBy",
                table: "Kvizovi",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Kategorije_CreatedBy",
                table: "Kategorije",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Kategorije_ModifiedBy",
                table: "Kategorije",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajVideo_CreatedBy",
                table: "HistorijskiDogadjajVideo",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajVideo_ModifiedBy",
                table: "HistorijskiDogadjajVideo",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajSlike_CreatedBy",
                table: "HistorijskiDogadjajSlike",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajSlike_ModifiedBy",
                table: "HistorijskiDogadjajSlike",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjaji_CreatedBy",
                table: "HistorijskiDogadjaji",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjaji_ModifiedBy",
                table: "HistorijskiDogadjaji",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajDokumentacije_CreatedBy",
                table: "HistorijskiDogadjajDokumentacije",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_HistorijskiDogadjajDokumentacije_ModifiedBy",
                table: "HistorijskiDogadjajDokumentacije",
                column: "ModifiedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorijskiDogadjajDokumentacije_Korisnici_CreatedBy",
                table: "HistorijskiDogadjajDokumentacije",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorijskiDogadjajDokumentacije_Korisnici_ModifiedBy",
                table: "HistorijskiDogadjajDokumentacije",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorijskiDogadjaji_Korisnici_CreatedBy",
                table: "HistorijskiDogadjaji",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorijskiDogadjaji_Korisnici_ModifiedBy",
                table: "HistorijskiDogadjaji",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorijskiDogadjajSlike_Korisnici_CreatedBy",
                table: "HistorijskiDogadjajSlike",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorijskiDogadjajSlike_Korisnici_ModifiedBy",
                table: "HistorijskiDogadjajSlike",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorijskiDogadjajVideo_Korisnici_CreatedBy",
                table: "HistorijskiDogadjajVideo",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistorijskiDogadjajVideo_Korisnici_ModifiedBy",
                table: "HistorijskiDogadjajVideo",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Kategorije_Korisnici_CreatedBy",
                table: "Kategorije",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Kategorije_Korisnici_ModifiedBy",
                table: "Kategorije",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Kvizovi_Korisnici_CreatedBy",
                table: "Kvizovi",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Kvizovi_Korisnici_ModifiedBy",
                table: "Kvizovi",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_KvizPitanja_Korisnici_CreatedBy",
                table: "KvizPitanja",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_KvizPitanja_Korisnici_ModifiedBy",
                table: "KvizPitanja",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_KvizPitanjaPonudjeneOpcije_Korisnici_CreatedBy",
                table: "KvizPitanjaPonudjeneOpcije",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_KvizPitanjaPonudjeneOpcije_Korisnici_ModifiedBy",
                table: "KvizPitanjaPonudjeneOpcije",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_KvizRezultati_Korisnici_CreatedBy",
                table: "KvizRezultati",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_KvizRezultati_Korisnici_ModifiedBy",
                table: "KvizRezultati",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_KvizRezultatiKorisnickiOdgovori_Korisnici_CreatedBy",
                table: "KvizRezultatiKorisnickiOdgovori",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_KvizRezultatiKorisnickiOdgovori_Korisnici_ModifiedBy",
                table: "KvizRezultatiKorisnickiOdgovori",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Novosti_Korisnici_CreatedBy",
                table: "Novosti",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Novosti_Korisnici_ModifiedBy",
                table: "Novosti",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NovostSlike_Korisnici_CreatedBy",
                table: "NovostSlike",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NovostSlike_Korisnici_ModifiedBy",
                table: "NovostSlike",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Pitanja_Korisnici_CreatedBy",
                table: "Pitanja",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Pitanja_Korisnici_ModifiedBy",
                table: "Pitanja",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Regija_Korisnici_CreatedBy",
                table: "Regija",
                column: "CreatedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Regija_Korisnici_ModifiedBy",
                table: "Regija",
                column: "ModifiedBy",
                principalTable: "Korisnici",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistorijskiDogadjajDokumentacije_Korisnici_CreatedBy",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorijskiDogadjajDokumentacije_Korisnici_ModifiedBy",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorijskiDogadjaji_Korisnici_CreatedBy",
                table: "HistorijskiDogadjaji");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorijskiDogadjaji_Korisnici_ModifiedBy",
                table: "HistorijskiDogadjaji");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorijskiDogadjajSlike_Korisnici_CreatedBy",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorijskiDogadjajSlike_Korisnici_ModifiedBy",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorijskiDogadjajVideo_Korisnici_CreatedBy",
                table: "HistorijskiDogadjajVideo");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorijskiDogadjajVideo_Korisnici_ModifiedBy",
                table: "HistorijskiDogadjajVideo");

            migrationBuilder.DropForeignKey(
                name: "FK_Kategorije_Korisnici_CreatedBy",
                table: "Kategorije");

            migrationBuilder.DropForeignKey(
                name: "FK_Kategorije_Korisnici_ModifiedBy",
                table: "Kategorije");

            migrationBuilder.DropForeignKey(
                name: "FK_Kvizovi_Korisnici_CreatedBy",
                table: "Kvizovi");

            migrationBuilder.DropForeignKey(
                name: "FK_Kvizovi_Korisnici_ModifiedBy",
                table: "Kvizovi");

            migrationBuilder.DropForeignKey(
                name: "FK_KvizPitanja_Korisnici_CreatedBy",
                table: "KvizPitanja");

            migrationBuilder.DropForeignKey(
                name: "FK_KvizPitanja_Korisnici_ModifiedBy",
                table: "KvizPitanja");

            migrationBuilder.DropForeignKey(
                name: "FK_KvizPitanjaPonudjeneOpcije_Korisnici_CreatedBy",
                table: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropForeignKey(
                name: "FK_KvizPitanjaPonudjeneOpcije_Korisnici_ModifiedBy",
                table: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropForeignKey(
                name: "FK_KvizRezultati_Korisnici_CreatedBy",
                table: "KvizRezultati");

            migrationBuilder.DropForeignKey(
                name: "FK_KvizRezultati_Korisnici_ModifiedBy",
                table: "KvizRezultati");

            migrationBuilder.DropForeignKey(
                name: "FK_KvizRezultatiKorisnickiOdgovori_Korisnici_CreatedBy",
                table: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropForeignKey(
                name: "FK_KvizRezultatiKorisnickiOdgovori_Korisnici_ModifiedBy",
                table: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropForeignKey(
                name: "FK_Novosti_Korisnici_CreatedBy",
                table: "Novosti");

            migrationBuilder.DropForeignKey(
                name: "FK_Novosti_Korisnici_ModifiedBy",
                table: "Novosti");

            migrationBuilder.DropForeignKey(
                name: "FK_NovostSlike_Korisnici_CreatedBy",
                table: "NovostSlike");

            migrationBuilder.DropForeignKey(
                name: "FK_NovostSlike_Korisnici_ModifiedBy",
                table: "NovostSlike");

            migrationBuilder.DropForeignKey(
                name: "FK_Pitanja_Korisnici_CreatedBy",
                table: "Pitanja");

            migrationBuilder.DropForeignKey(
                name: "FK_Pitanja_Korisnici_ModifiedBy",
                table: "Pitanja");

            migrationBuilder.DropForeignKey(
                name: "FK_Regija_Korisnici_CreatedBy",
                table: "Regija");

            migrationBuilder.DropForeignKey(
                name: "FK_Regija_Korisnici_ModifiedBy",
                table: "Regija");

            migrationBuilder.DropIndex(
                name: "IX_Regija_CreatedBy",
                table: "Regija");

            migrationBuilder.DropIndex(
                name: "IX_Regija_ModifiedBy",
                table: "Regija");

            migrationBuilder.DropIndex(
                name: "IX_Pitanja_CreatedBy",
                table: "Pitanja");

            migrationBuilder.DropIndex(
                name: "IX_Pitanja_ModifiedBy",
                table: "Pitanja");

            migrationBuilder.DropIndex(
                name: "IX_NovostSlike_CreatedBy",
                table: "NovostSlike");

            migrationBuilder.DropIndex(
                name: "IX_NovostSlike_ModifiedBy",
                table: "NovostSlike");

            migrationBuilder.DropIndex(
                name: "IX_Novosti_CreatedBy",
                table: "Novosti");

            migrationBuilder.DropIndex(
                name: "IX_Novosti_ModifiedBy",
                table: "Novosti");

            migrationBuilder.DropIndex(
                name: "IX_KvizRezultatiKorisnickiOdgovori_CreatedBy",
                table: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropIndex(
                name: "IX_KvizRezultatiKorisnickiOdgovori_ModifiedBy",
                table: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropIndex(
                name: "IX_KvizRezultati_CreatedBy",
                table: "KvizRezultati");

            migrationBuilder.DropIndex(
                name: "IX_KvizRezultati_ModifiedBy",
                table: "KvizRezultati");

            migrationBuilder.DropIndex(
                name: "IX_KvizPitanjaPonudjeneOpcije_CreatedBy",
                table: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropIndex(
                name: "IX_KvizPitanjaPonudjeneOpcije_ModifiedBy",
                table: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropIndex(
                name: "IX_KvizPitanja_CreatedBy",
                table: "KvizPitanja");

            migrationBuilder.DropIndex(
                name: "IX_KvizPitanja_ModifiedBy",
                table: "KvizPitanja");

            migrationBuilder.DropIndex(
                name: "IX_Kvizovi_CreatedBy",
                table: "Kvizovi");

            migrationBuilder.DropIndex(
                name: "IX_Kvizovi_ModifiedBy",
                table: "Kvizovi");

            migrationBuilder.DropIndex(
                name: "IX_Kategorije_CreatedBy",
                table: "Kategorije");

            migrationBuilder.DropIndex(
                name: "IX_Kategorije_ModifiedBy",
                table: "Kategorije");

            migrationBuilder.DropIndex(
                name: "IX_HistorijskiDogadjajVideo_CreatedBy",
                table: "HistorijskiDogadjajVideo");

            migrationBuilder.DropIndex(
                name: "IX_HistorijskiDogadjajVideo_ModifiedBy",
                table: "HistorijskiDogadjajVideo");

            migrationBuilder.DropIndex(
                name: "IX_HistorijskiDogadjajSlike_CreatedBy",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropIndex(
                name: "IX_HistorijskiDogadjajSlike_ModifiedBy",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropIndex(
                name: "IX_HistorijskiDogadjaji_CreatedBy",
                table: "HistorijskiDogadjaji");

            migrationBuilder.DropIndex(
                name: "IX_HistorijskiDogadjaji_ModifiedBy",
                table: "HistorijskiDogadjaji");

            migrationBuilder.DropIndex(
                name: "IX_HistorijskiDogadjajDokumentacije_CreatedBy",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropIndex(
                name: "IX_HistorijskiDogadjajDokumentacije_ModifiedBy",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Regija");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Regija");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "Regija");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Regija");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Pitanja");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Pitanja");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "Pitanja");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Pitanja");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "NovostSlike");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "NovostSlike");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "NovostSlike");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "NovostSlike");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Novosti");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Novosti");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "Novosti");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Novosti");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "KvizRezultatiKorisnickiOdgovori");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "KvizRezultati");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "KvizRezultati");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "KvizRezultati");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "KvizRezultati");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "KvizPitanjaPonudjeneOpcije");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "KvizPitanja");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "KvizPitanja");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "KvizPitanja");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "KvizPitanja");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Kvizovi");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Kvizovi");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "Kvizovi");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Kvizovi");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Korisnici");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "Korisnici");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Kategorije");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Kategorije");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "Kategorije");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Kategorije");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "Institucije");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "Institucije");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "HistorijskiDogadjajVideo");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "HistorijskiDogadjajVideo");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "HistorijskiDogadjajVideo");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "HistorijskiDogadjajVideo");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "HistorijskiDogadjaji");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "HistorijskiDogadjaji");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "HistorijskiDogadjaji");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "HistorijskiDogadjaji");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "AutentikacijaTokeni");

            migrationBuilder.DropColumn(
                name: "ModifiedAtUtc",
                table: "AutentikacijaTokeni");
        }
    }
}
