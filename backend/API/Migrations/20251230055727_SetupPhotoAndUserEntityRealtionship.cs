using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class SetupPhotoAndUserEntityRealtionship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Photos_PhotoId1",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_PhotoId1",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PhotoId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PhotoId1",
                table: "AspNetUsers");

            migrationBuilder.CreateIndex(
                name: "IX_Photos_UserId",
                table: "Photos",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_AspNetUsers_UserId",
                table: "Photos",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_AspNetUsers_UserId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_UserId",
                table: "Photos");

            migrationBuilder.AddColumn<string>(
                name: "PhotoId",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoId1",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_PhotoId1",
                table: "AspNetUsers",
                column: "PhotoId1");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Photos_PhotoId1",
                table: "AspNetUsers",
                column: "PhotoId1",
                principalTable: "Photos",
                principalColumn: "Id");
        }
    }
}
