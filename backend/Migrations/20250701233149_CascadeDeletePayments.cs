using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eshop_api.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeletePayments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Payments_AuctionItemId",
                table: "Payments",
                column: "AuctionItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_AuctionItems_AuctionItemId",
                table: "Payments",
                column: "AuctionItemId",
                principalTable: "AuctionItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_AuctionItems_AuctionItemId",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Payments_AuctionItemId",
                table: "Payments");
        }
    }
}
