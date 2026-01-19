using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ApartmentPhotosAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApartmentId",
                table: "Photos",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_ApartmentId",
                table: "Photos",
                column: "ApartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Apartments_ApartmentId",
                table: "Photos",
                column: "ApartmentId",
                principalTable: "Apartments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Apartments_ApartmentId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_ApartmentId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "ApartmentId",
                table: "Photos");
        }
    }
}
