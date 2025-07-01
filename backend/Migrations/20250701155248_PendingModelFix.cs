using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eshop_api.Migrations
{
    /// <inheritdoc />
    public partial class PendingModelFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AuctionId",
                table: "Payments",
                newName: "AuctionItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AuctionItemId",
                table: "Payments",
                newName: "AuctionId");
        }
    }
}
