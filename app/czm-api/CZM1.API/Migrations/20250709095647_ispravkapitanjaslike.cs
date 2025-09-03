using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CZM1.API.Migrations
{
    /// <inheritdoc />
    public partial class ispravkapitanjaslike : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrikaziUDogadjaju",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.DropColumn(
                name: "PrikaziUPitanju",
                table: "HistorijskiDogadjajSlike");

            migrationBuilder.CreateTable(
                name: "PitanjeSlikaEntity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PitanjeId = table.Column<int>(type: "int", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    ModifiedBy = table.Column<int>(type: "int", nullable: true),
                    SlikaPath = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    IzvorInfo = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    IzvorUrl = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    Redoslijed = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PitanjeSlikaEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PitanjeSlikaEntity_Korisnici_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Korisnici",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PitanjeSlikaEntity_Korisnici_ModifiedBy",
                        column: x => x.ModifiedBy,
                        principalTable: "Korisnici",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PitanjeSlikaEntity_Pitanja_PitanjeId",
                        column: x => x.PitanjeId,
                        principalTable: "Pitanja",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PitanjeSlikaEntity_CreatedBy",
                table: "PitanjeSlikaEntity",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PitanjeSlikaEntity_ModifiedBy",
                table: "PitanjeSlikaEntity",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PitanjeSlikaEntity_PitanjeId",
                table: "PitanjeSlikaEntity",
                column: "PitanjeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PitanjeSlikaEntity");

            migrationBuilder.AddColumn<bool>(
                name: "PrikaziUDogadjaju",
                table: "HistorijskiDogadjajSlike",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PrikaziUPitanju",
                table: "HistorijskiDogadjajSlike",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
