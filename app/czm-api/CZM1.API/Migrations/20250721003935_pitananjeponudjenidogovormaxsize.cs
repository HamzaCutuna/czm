using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CZM1.API.Migrations
{
    /// <inheritdoc />
    public partial class pitananjeponudjenidogovormaxsize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TekstOdgovora",
                table: "KvizPitanjaPonudjeneOpcije",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(128)",
                oldMaxLength: 128);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TekstOdgovora",
                table: "KvizPitanjaPonudjeneOpcije",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(512)",
                oldMaxLength: 512);
        }
    }
}
