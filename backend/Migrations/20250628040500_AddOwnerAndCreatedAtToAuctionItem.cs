using Microsoft.EntityFrameworkCore.Migrations;
using System;

public partial class AddOwnerAndCreatedAtToAuctionItem : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "OwnerId",
            table: "AuctionItems",
            nullable: true);

        migrationBuilder.AddColumn<DateTime>(
            name: "CreatedAt",
            table: "AuctionItems",
            nullable: false,
            defaultValue: DateTime.UtcNow);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "OwnerId",
            table: "AuctionItems");
        migrationBuilder.DropColumn(
            name: "CreatedAt",
            table: "AuctionItems");
    }
} 