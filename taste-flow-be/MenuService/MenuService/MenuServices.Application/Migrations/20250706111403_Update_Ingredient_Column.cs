using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MenuServices.Application.Migrations
{
    /// <inheritdoc />
    public partial class Update_Ingredient_Column : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Ingredients",
                table: "Ingredients");

            migrationBuilder.DropIndex(
                name: "IX_Ingredients_MenuId",
                table: "Ingredients");

            migrationBuilder.DropColumn(
                name: "MenuItemId",
                table: "Ingredients");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Ingredients",
                table: "Ingredients",
                columns: new[] { "MenuId", "Id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Ingredients",
                table: "Ingredients");

            migrationBuilder.AddColumn<int>(
                name: "MenuItemId",
                table: "Ingredients",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Ingredients",
                table: "Ingredients",
                columns: new[] { "MenuItemId", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_MenuId",
                table: "Ingredients",
                column: "MenuId");
        }
    }
}
