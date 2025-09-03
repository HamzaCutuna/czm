using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CZM1.API.Migrations
{
    /// <inheritdoc />
    public partial class ispravkapitanjaslike2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrikaziUDogadjaju",
                table: "HistorijskiDogadjajDokumentacije");

            migrationBuilder.DropColumn(
                name: "PrikaziUPitanju",
                table: "HistorijskiDogadjajDokumentacije");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PrikaziUDogadjaju",
                table: "HistorijskiDogadjajDokumentacije",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PrikaziUPitanju",
                table: "HistorijskiDogadjajDokumentacije",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
