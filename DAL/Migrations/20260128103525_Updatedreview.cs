using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class Updatedreview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "Reviews",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ParentId",
                table: "Reviews",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Reviews_ParentId",
                table: "Reviews",
                column: "ParentId",
                principalTable: "Reviews",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Reviews_ParentId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_ParentId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "Reviews");
        }
    }
}
