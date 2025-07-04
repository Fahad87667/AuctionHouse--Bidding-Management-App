﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eshop_api.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerAndCreatedAtToAuctionItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AuctionItems",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "AuctionItems",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AuctionItems");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "AuctionItems");
        }
    }
}
