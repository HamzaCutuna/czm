using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CZM1.API.Migrations
{
    /// <inheritdoc />
    public partial class init2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DokumentacijaUrl",
                table: "HistorijskiDogadjajDokumentacije",
                newName: "EksterniUrl");

            migrationBuilder.RenameColumn(
                name: "DokumentacijaOpis",
                table: "HistorijskiDogadjajDokumentacije",
                newName: "Opis");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Opis",
                table: "HistorijskiDogadjajDokumentacije",
                newName: "DokumentacijaOpis");

            migrationBuilder.RenameColumn(
                name: "EksterniUrl",
                table: "HistorijskiDogadjajDokumentacije",
                newName: "DokumentacijaUrl");
        }
    }
}
